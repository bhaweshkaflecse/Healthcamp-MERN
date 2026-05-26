import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { nepalLocation } from './helper/data/nepalLocation';

@Controller()
@ApiTags("Application")
export class AppController {
  @Get()
  getHello(): string {
    return "Nameste Nepal !";
  }

  @Get("get-nepal-province")
  @ApiOperation({ summary: "Get All Nepal Provinces" })
  getAllNepalProvince() {
    return nepalLocation.map(province => ({
      id: province.id,
      name: province.name
    })
    );
  }

  @Get("get-nepal-district/:provinceId")
  @ApiOperation({ summary: "Get All Nepal Districts" })
  getAllNepalDistrict(@Param("provinceId") provinceId: number) {
    return nepalLocation.find(province => province.id === provinceId).districtList.map(district => district.name);
  }
}
