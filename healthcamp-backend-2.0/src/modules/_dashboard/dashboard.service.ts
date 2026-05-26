import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { clientEntity } from 'src/model/sql/client.entity';
import { Between, In, LessThan, MoreThan, Repository } from 'typeorm';
import { packageEntity } from 'src/model/sql/package.entity';
import { eventEntity } from 'src/model/sql/event.entity';
import { enrollEntity } from 'src/model/sql/enrollment.entity';
import {
  bookingStatus,
  enrollStatus,
  eventStatus,
  kycStatus,
  paymentStatus,
  packagePurchaseStatType,
  PaymentData,
} from 'src/helper/types/index.type';
import { bookingEntity } from 'src/model/sql/booking.entity';
import { bookingDateEntity } from 'src/model/sql/booking_date.entity';
import { subDays, subMonths } from 'date-fns';
import { paymentEntity } from 'src/model/sql/payment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(clientEntity)
    private clientRepository: Repository<clientEntity>,

    @InjectRepository(packageEntity)
    private packageRepository: Repository<clientEntity>,

    @InjectRepository(eventEntity)
    private eventRepository: Repository<eventEntity>,

    @InjectRepository(enrollEntity)
    private enrollRepository: Repository<enrollEntity>,

    @InjectRepository(paymentEntity)
    private paymentRepository: Repository<paymentEntity>,

    @InjectRepository(bookingEntity)
    private bookingRepository: Repository<bookingEntity>,

    @InjectRepository(bookingDateEntity)
    private bookingDateRepository: Repository<bookingDateEntity>,
  ) {}
  async findBusiness() {
    const packageLength = await this.packageRepository.count();
    const client = await this.clientRepository.count();
    const soldPackage = await this.enrollRepository.count({
      where: { status: enrollStatus.approved },
    });
    const event = await this.eventRepository.count({
      where: {
        status: eventStatus.approved,
        // date:LessThan(new Date())
      },
    });
    return {
      packageLength,
      client,
      soldPackage,
      event,
    };
  }

  async findTeam(id: string) {
    const client = await this.clientRepository.count({
      where: { teamLead: { id } },
    });
    const booking = await this.bookingDateRepository.count({
      where: {
        booking: {
          status: bookingStatus.booked,
          client: {
            teamLead: { id },
          },
        },
        // date: MoreThan(new Date()),
      },
    });

    const completedEvent = await this.bookingDateRepository.count({
      where: {
        event:{
          status:eventStatus.completed
        },
        booking: {
          client: {
            teamLead: { id },
          },
        },
        // date: MoreThan(new Date()),
      },
    });

    const upcomingEvent = await this.bookingDateRepository.count({
      where: {
        event:{
          status:eventStatus.pending
        },
        booking: {
          client: {
            teamLead: { id },
          },
        },
        // date: MoreThan(new Date()),
      },
    });

    const bookingRequest = await this.bookingRepository.count({
      where: {
        status: In([bookingStatus.hold]),
        client: { teamLead: { id } },
      },
    });

    return {
      client,
      upcomingEvent,
      completedEvent,
      bookingRequest,
      clientApproved: await this.countByClientStatus(id, kycStatus.approved),
      clientPending: await this.countByClientStatus(id, kycStatus.pending),
      clientDenied: await this.countByClientStatus(id, kycStatus.reject),
    };
  }

  async findTeamKyc(id: string) {
    return {
      clientApproved: await this.countByClientStatus(id, kycStatus.approved),
      clientPending: await this.countByClientStatus(id, kycStatus.pending),
      clientDenied: await this.countByClientStatus(id, kycStatus.reject),
    };
  }

  async findPurchaseStat(type: packagePurchaseStatType) {
    const now = new Date();
    let startDate: Date;

    if (type === packagePurchaseStatType.week) {
      startDate = subDays(now, 7);
    } else if (type === packagePurchaseStatType.month) {
      startDate = subMonths(now, 12);
    } else if(type===packagePurchaseStatType.year){
    startDate = new Date("2024-01-01T11:45:13.212Z"); 
    } else {
      throw new Error('Invalid range type');
    }

    const purchasePackage = await this.paymentRepository.find({
      where: {
        status: paymentStatus.approved,
        createdAt: Between(startDate, now),
      },
      select: {
        id: true,
        price: true,
        createdAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const purchaseStat = this.parsedData(purchasePackage, type);
    const totalAmount = purchaseStat.reduce((sum, item) => sum + item.amount, 0);
    return {
      totalAmount,
      purchaseStat
    };
  }

  countByClientStatus = async (
    id: string,
    kycStatus: kycStatus,
  ): Promise<Number> =>
    await this.clientRepository.count({
      where: { teamLead: { id }, kyc: { kycStatus } },
    });

  parsedData = (data: any, type: packagePurchaseStatType) => {
    switch (type) {
      case packagePurchaseStatType.week:
        return this.calculateWeeklyPurchasesByDay(data);
      case packagePurchaseStatType.month:
        return this.calculateMonthlyPurchases(data);
      case packagePurchaseStatType.year:
        return this.calculateYearlyPurchases(data);
      default:
        throw new ForbiddenException('invalid input');
    }
  };

calculateYearlyPurchases = (data: PaymentData[]) => {
  // Extract all unique years from the data
  const yearsSet = new Set<number>();

  data.forEach((item) => {
    const date = new Date(item.createdAt);
    yearsSet.add(date.getFullYear());
  });

  // Convert the set to an array and sort in descending order
  const uniqueYears = Array.from(yearsSet).sort((a, b) => b - a);

  // Initialize yearly stats
  const yearlyStats: Record<number, number> = uniqueYears.reduce(
    (acc, year) => {
      acc[year] = 0;
      return acc;
    },
    {} as Record<number, number>,
  );

  // Aggregate purchases by summing up prices per year
  data.forEach((item) => {
    const date = new Date(item.createdAt);
    const year = date.getFullYear();
    yearlyStats[year] += item.price; // Sum all transactions in the same year
  });

  // Convert the object to an array format
  return uniqueYears.map((year) => ({
    label: year,
    amount: yearlyStats[year] || 0, // Ensure every year is included
  }));
};

  calculateMonthlyPurchases = (data: PaymentData[]) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Generate the last 12 months in descending order (including year)
    const recentMonths = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`; // Ensure uniqueness by year
      recentMonths.push(monthYear);
    }

    // Initialize monthly stats
    const monthlyStats: Record<string, number> = recentMonths.reduce(
      (acc, monthYear) => {
        acc[monthYear] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Aggregate purchases by summing up prices per month (including year for uniqueness)
    data.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyStats.hasOwnProperty(monthYear)) {
        monthlyStats[monthYear] += item.price; // Sum all transactions in the same month
      }
    });

    // Convert the object to an array format
    return recentMonths.map((monthYear) => ({
      label: monthYear,
      amount: monthlyStats[monthYear] || 0, // Ensure every month is included
    }));
  };

  calculateWeeklyPurchasesByDay = (data: PaymentData[]) => {
    const currentDate = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate last 7 days in descending order from today
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const targetDate = new Date(currentDate);
      targetDate.setDate(currentDate.getDate() - i);
      return daysOfWeek[targetDate.getDay()];
    });

    // Initialize weekly stats
    const weeklyStats: Record<string, number> = last7Days.reduce(
      (acc, day) => {
        acc[day] = 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Aggregate purchases
    data.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      const dayName = daysOfWeek[itemDate.getDay()];
      if (weeklyStats.hasOwnProperty(dayName)) {
        weeklyStats[dayName] += item.price;
      }
    });

    return last7Days
    .map((day) => ({ label: day, amount: weeklyStats[day] }))
    .reverse();
  };

  findClient() {}
}
