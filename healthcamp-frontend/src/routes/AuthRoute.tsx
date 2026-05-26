import { RouteObject } from "react-router-dom";
import Loadable from "../components/Loadable";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { PermissionType } from "../type";
import FindStudent from "../pages/dataEntry/FindStudent";
import ServiceDetails from "../pages/dataEntry/ServiceDetails";
import EditAttributes from "../pages/dataEntry/EditAttributes";
import BookingCalendar from "../pages/dashboard/calendar/BookingCalendar";
import CompletedEvents from "../pages/teamDashboard/event/CompletedEvents";
import ViewTeam from "../pages/teamDashboard/teams/ViewUnitTeam";
import IssuesList from "../pages/itSupport/IssuesList";
import TicketForm from "../pages/itSupport/TicketForm";
import EditIssue from "../pages/itSupport/EditIssue";
import ClientLists from "../pages/sales/ClientLists";
import LeadDetails from "../pages/sales/LeadDetails";
import ViewTeamLeadMembers from "../pages/teamDashboard/teams/ViewTeamLeadMembers";
import MyTeam from "../pages/unit-coordinator/MyTeam";
import PublishReport from "../pages/teamDashboard/event/PublishReport";
import ParticipantDataHistory from "../pages/teamDashboard/event/ParticipantDataHistory";

const CallCenterHome = Loadable(lazy(() => import("../pages/callCenter/Home")));
const DataLog = Loadable(lazy(() => import("../pages/callCenter/DataLog")));

const AssignedMembers = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/AssignedMembers"))
);
const Finance = Loadable(
  lazy(() => import("../pages/dashboard/finance/Finance"))
);

const PackageManagement = Loadable(
  lazy(() => import("../pages/dashboard/package management/PackageManagement"))
);
const PaginationEx = Loadable(
  lazy(() => import("../pages/dashboard/rough/PaginationEx"))
);
const EventCalendar = Loadable(
  lazy(() => import("../pages/dashboard/EventCalendar/EventCalendar"))
);
const DashBoardSettings = Loadable(
  lazy(() => import("../pages/settings/Setting"))
);
const GetService = Loadable(
  lazy(() => import("../pages/dashboard/service Management/GetService"))
);
const EditService = Loadable(
  lazy(() => import("../pages/dashboard/service Management/EditService"))
);
const ChangeRole = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/ChangeRole"))
);
const SaveRole = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/SaveRole"))
);
const DeleteUser = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/DeleteUser"))
);
const SaveTeamLead = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/SaveTeamLead"))
);
const UpdateAdmin = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/UpdateAdmin"))
);
const UpdateStaff = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/UpdateStaff"))
);
const CreatePackage = Loadable(
  lazy(() => import("../pages/dashboard/package management/CreatePackage"))
);
const PackgaeService = Loadable(
  lazy(() => import("../pages/dashboard/package management/PackageService"))
);
const Package = Loadable(
  lazy(() => import("../pages/dashboard/package management/Package"))
);
const GetPackage = Loadable(
  lazy(() => import("../pages/dashboard/package management/GetPackage"))
);
const EditPackage = Loadable(
  lazy(() => import("../pages/dashboard/package management/EditPackage"))
);
const CreateTeam = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/CreateTeam")
  )
);
const UnitLeader = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/UnitLeader")
  )
);
const TeamLeader = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/TeamLeader")
  )
);
const DataLeader = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/DataLeader")
  )
);
const GetTeam = Loadable(
  lazy(
    () => import("../pages/dashboard/Role Management/Team Management/GetTeam")
  )
);
const UpdateTeam = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/UpdateTeam")
  )
);
const ChangeTeam = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/ChangeTeam")
  )
);
const CreateSubTeam = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/CreateSubTeam")
  )
);
const ClientInformation = Loadable(
  lazy(() => import("../pages/dashboard/clients/ClientInformation"))
);
const MemberList = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/MemberList")
  )
);
const SubTeam = Loadable(
  lazy(
    () => import("../pages/dashboard/Role Management/Team Management/subTeam")
  )
);
const EditSubTeam = Loadable(
  lazy(
    () =>
      import("../pages/dashboard/Role Management/Team Management/EditSubTeam")
  )
);
const AssignTeamLead = Loadable(
  lazy(() => import("../pages/dashboard/clients/AssignTeamLead"))
);
const MyProfile = Loadable(lazy(() => import("../pages/settings/MyProfile")));
const AddMember = Loadable(
  lazy(
    () => import("../pages/dashboard/Role Management/Team Management/AddMember")
  )
);
const MyClients = Loadable(
  lazy(() => import("../pages/teamDashboard/MyClients"))
);
const ClientInformationTeamLead = Loadable(
  lazy(() => import("../pages/teamDashboard/ClientInformation"))
);
const GetTeams = Loadable(
  lazy(() => import("../pages/teamDashboard/GetTeams"))
);
const TeamKyc = Loadable(
  lazy(() => import("../pages/teamDashboard/kycStatus/TeamKyc"))
);
const ClientDetailsKyc = Loadable(
  lazy(() => import("../pages/teamDashboard/kycStatus/ClientDetailsKyc"))
);
const PackageList = Loadable(
  lazy(() => import("../pages/teamDashboard/calendar/PackageList"))
);
const ServiceOfPackage = Loadable(
  lazy(() => import("../pages/teamDashboard/calendar/ServiceOfPackage"))
);
const OpenCalendar = Loadable(
  lazy(() => import("../pages/teamDashboard/calendar/OpenCalendar"))
);
const SetCalendar = Loadable(
  lazy(() => import("../pages/teamDashboard/calendar/SetCalendar"))
);
const Teams = Loadable(
  lazy(() => import("../pages/teamDashboard/teams/Teams"))
);
const PackageRequest = Loadable(
  lazy(() => import("../pages/teamDashboard/Package/PackageRequest"))
);
const PackageVerify = Loadable(
  lazy(() => import("../pages/teamDashboard/Package/PackageVerify"))
);
const EventBooking = Loadable(
  lazy(() => import("../pages/teamDashboard/event/EventBooking"))
);
const BookingRequest = Loadable(
  lazy(() => import("../pages/teamDashboard/event/BookingRequest"))
);
const UpcomingEventsTeam = Loadable(
  lazy(() => import("../pages/teamDashboard/event/UpcomingEvents"))
);
const EventCalendarTeam = Loadable(
  lazy(() => import("../pages/teamDashboard/event/EventCalendar"))
);
const AssignSubteam = Loadable(
  lazy(() => import("../pages/teamDashboard/event/AssignSubteam"))
);
const Subteam = Loadable(
  lazy(() => import("../pages/teamDashboard/event/Subteam"))
);
const Events = Loadable(lazy(() => import("../pages/unit-coordinator/Events")));
const Events2 = Loadable(
  lazy(() => import("../pages/unit-coordinator/Events2"))
);
const EventDetails = Loadable(
  lazy(() => import("../pages/unit-coordinator/EventDetails"))
);
const EventStarted = Loadable(
  lazy(() => import("../pages/unit-coordinator/EventStarted"))
);
const EventCompleted = Loadable(
  lazy(() => import("../pages/unit-coordinator/EventCompleted"))
);
const UnitProfile = Loadable(
  lazy(() => import("../pages/unit-coordinator/UnitProfile"))
);
const EditUnitProfile = Loadable(
  lazy(() => import("../pages/unit-coordinator/EditUnitProfile"))
);
const ClientApprovalstatus = Loadable(
  lazy(() => import("../pages/dashboard/clients/ClientApprovalstatus"))
);

const DashboardLayout = Loadable(
  lazy(() => import("../layout/dashboard-layout/DashboardLayout"))
);
const Home = Loadable(lazy(() => import("../pages/dashboard/Home")));
const RoleManagement = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/RoleManagement"))
);

const ClientDetails = Loadable(
  lazy(() => import("../pages/dashboard/clients/ClientDetails"))
);
const CreateService = Loadable(
  lazy(() => import("../pages/dashboard/service Management/CreateService"))
);
const AssignMember = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/AssignMember"))
);
const Services = Loadable(
  lazy(() => import("../pages/dashboard/service Management/Services"))
);
const TeamLead = Loadable(
  lazy(() => import("../pages/dashboard/Role Management/TeamLead"))
);
const CreateEvent = Loadable(
  lazy(() => import("../pages/dashboard/Event Management/CreateEvent"))
);
const UpcomingEvents = Loadable(
  lazy(() => import("../pages/dashboard/Event Management/UpcomingEvents"))
);
const TodayEvents = Loadable(
  lazy(() => import("../pages/dashboard/Event Management/TodayEvents"))
);
const EventDetail = Loadable(
  lazy(() => import("../pages/dashboard/Event Management/EventDetail"))
);
const EventManagement = Loadable(
  lazy(() => import("../pages/dashboard/Event Management/EventManagement"))
);
const RegisteredClients = Loadable(
  lazy(() => import("../pages/dashboard/clients/RegisteredClients"))
);
const PendingUser = Loadable(
  lazy(() => import("../pages/dashboard/clients/PendingUser"))
);
const ApprovedUser = Loadable(
  lazy(() => import("../pages/dashboard/clients/ApprovedUser"))
);
const DeniedUser = Loadable(
  lazy(() => import("../pages/dashboard/clients/DeniedUser"))
);
const CreateCalendar = Loadable(
  lazy(() => import("../pages/dashboard/calendar/CreateCalendar"))
);
const CreateCarousel = Loadable(
  lazy(() => import("../pages/dashboard/carousel/Carousel"))
);
const ReportForm = Loadable(
  lazy(() => import("../pages/dataEntry/ReportForm"))
);
const RepotSubmission = Loadable(
  lazy(() => import("../pages/dataEntry/RepotSubmission"))
);
const ParticipantDetails = Loadable(
  lazy(() => import("../pages/dataEntry/ParticipantDetails"))
);

const DataEntryHome = Loadable(lazy(() => import("../pages/dataEntry/Home")));
const FinanceProfile = Loadable(
  lazy(() => import("../pages/finance/FinanceProfile"))
);
const FinanceClient = Loadable(
  lazy(() => import("../pages/finance/FinanceClient"))
);
const RecentPaid = Loadable(lazy(() => import("../pages/finance/RecentPaid")));

const FinanceHome = Loadable(
  lazy(() => import("../pages/finance/FinanceDashboard"))
);

const AuthRoute: RouteObject = {
  path: "/",
  element: <DashboardLayout />,
  children: [
    //Call Center Route From Here
    {
      path: "/call-center",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.callCentre]}>
          <CallCenterHome />
        </ProtectedRoute>
      ),
    },
    {
      path: "/data-log",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.callCentre]}>
          <DataLog />
        </ProtectedRoute>
      ),
    },

    //Dashboard Route From Here
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.businessHead,
            PermissionType.teamLead,
            PermissionType.unitCoordinator,
            PermissionType.dataEntry,
            PermissionType.finance,
            PermissionType.callCentre,
            PermissionType.ITteam,
            PermissionType.sales,
          ]}
        >
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/services",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <Services />
        </ProtectedRoute>
      ),
    },
    {
      path: "role",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <RoleManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "changerole",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <ChangeRole />
        </ProtectedRoute>
      ),
    },
    {
      path: "saverole",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <SaveRole />
        </ProtectedRoute>
      ),
    },
    {
      path: "deleteuser",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <DeleteUser />
        </ProtectedRoute>
      ),
    },

    {
      path: "assign",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <AssignMember />
        </ProtectedRoute>
      ),
    },
    {
      path: "assigned-members",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <AssignedMembers />
        </ProtectedRoute>
      ),
    },
    {
      path: "/member-list/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <TeamLead />
        </ProtectedRoute>
      ),
    },
    {
      path: "savenewstaff",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <SaveTeamLead />
        </ProtectedRoute>
      ),
    },
    {
      path: "updateadmin",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <UpdateAdmin />
        </ProtectedRoute>
      ),
    },
    {
      path: "updatestaff",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <UpdateStaff />
        </ProtectedRoute>
      ),
    },
    {
      path: "create-team",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <CreateTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "unit-leader",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <UnitLeader />
        </ProtectedRoute>
      ),
    },
    {
      path: "team-leader",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <TeamLeader />
        </ProtectedRoute>
      ),
    },
    {
      path: "data-leader",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <DataLeader />
        </ProtectedRoute>
      ),
    },
    {
      path: "member-list",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <MemberList />
        </ProtectedRoute>
      ),
    },
    {
      path: "member-add",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <AddMember />
        </ProtectedRoute>
      ),
    },
    {
      path: "team-list/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <GetTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "update-subteam",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <EditSubTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "update-team",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <UpdateTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "change-team",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <ChangeTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "create-subteam",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <CreateSubTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "event",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <CreateEvent />
        </ProtectedRoute>
      ),
    },
    {
      path: "today-event",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <TodayEvents />
        </ProtectedRoute>
      ),
    },
    {
      path: "upcoming-event",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <UpcomingEvents />
        </ProtectedRoute>
      ),
    },
    {
      path: "event-detail",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <EventDetail />
        </ProtectedRoute>
      ),
    },
    {
      path: "event-management",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <EventManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "client",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <RegisteredClients />
        </ProtectedRoute>
      ),
    },
    {
      path: "assignteamlead/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <AssignTeamLead />
        </ProtectedRoute>
      ),
    },
    {
      path: "/client-info/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <ClientInformation />
        </ProtectedRoute>
      ),
    },
    {
      path: "pending-users",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <PendingUser />
        </ProtectedRoute>
      ),
    },
    {
      path: "approved-users",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <ApprovedUser />
        </ProtectedRoute>
      ),
    },
    {
      path: "denied-users",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <DeniedUser />
        </ProtectedRoute>
      ),
    },
    {
      path: "client/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <ClientDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "finance",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <Finance />
        </ProtectedRoute>
      ),
    },
    {
      path: "/package",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <PackageManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create-package",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <CreatePackage />
        </ProtectedRoute>
      ),
    },
    {
      path: "package-services",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <PackgaeService />
        </ProtectedRoute>
      ),
    },
    {
      path: "add-package",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <Package />
        </ProtectedRoute>
      ),
    },
    {
      path: "editpackage/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <EditPackage />
        </ProtectedRoute>
      ),
    },
    {
      path: "clientapproval",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <ClientApprovalstatus />
        </ProtectedRoute>
      ),
    },
    {
      path: "pagination",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <PaginationEx />
        </ProtectedRoute>
      ),
    },
    {
      path: "eventcalender",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <EventCalendar />
        </ProtectedRoute>
      ),
    },
    {
      path: "booking-calendar/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <BookingCalendar />
        </ProtectedRoute>
      ),
    },
    {
      path: "settings",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.businessHead,
            PermissionType.teamLead,
            PermissionType.unitCoordinator,
            PermissionType.dataEntry,
            PermissionType.finance,
            PermissionType.callCentre,
            PermissionType.ITteam,
            PermissionType.sales,
          ]}
        >
          <DashBoardSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/createservices",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <CreateService />
        </ProtectedRoute>
      ),
    },
    {
      path: "service/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <GetService />
        </ProtectedRoute>
      ),
    },
    {
      path: "editservice",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <EditService />
        </ProtectedRoute>
      ),
    },
    {
      path: "package/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <GetPackage />
        </ProtectedRoute>
      ),
    },
    {
      path: "calendar/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <CreateCalendar />
        </ProtectedRoute>
      ),
    },
    {
      path: "carousel",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.businessHead]}>
          <CreateCarousel />
        </ProtectedRoute>
      ),
    },
    {
      path: "view-teamLeadMembers/:id",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.businessHead,
            PermissionType.teamLead,
          ]}
        >
          <ViewTeamLeadMembers />
        </ProtectedRoute>
      ),
    },

    {
      path: "profile",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.businessHead,
            PermissionType.teamLead,
            PermissionType.unitCoordinator,
            PermissionType.dataEntry,
            PermissionType.finance,
            PermissionType.callCentre,
            PermissionType.ITteam,
            PermissionType.sales,
          ]}
        >
          <MyProfile />
        </ProtectedRoute>
      ),
    },
    // {
    //   path: "logout",
    //   element: (
    //     <ProtectedRoute
    //       requiredPermission={[
    //         PermissionType.businessHead,
    //         PermissionType.teamLead,
    //         PermissionType.unitCoordinator,
    //         PermissionType.dataEntry,
    //         PermissionType.finance,
    //         PermissionType.callCentre,
    //       ]}
    //     >
    //       <Logout />
    //     </ProtectedRoute>
    //   ),
    // },
    //DataEntry Route From Here
    {
      path: "/data-entry-dashboard",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.dataEntry]}>
          <DataEntryHome />
        </ProtectedRoute>
      ),
    },
    {
      path: "/find-student/:reportId",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.dataEntry]}>
          <FindStudent />
        </ProtectedRoute>
      ),
    },
    {
      path: "/edit-attributes/:reportId",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.dataEntry]}>
          <EditAttributes />
        </ProtectedRoute>
      ),
    },
    {
      path: "/participant-details/:reportId",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.dataEntry]}>
          <ParticipantDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/service-details",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.dataEntry]}>
          <ServiceDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/report-form",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.dataEntry]}>
          <ReportForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/submit-report",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.dataEntry]}>
          <RepotSubmission />
        </ProtectedRoute>
      ),
    },
    //Finance Route From Here
    {
      path: "/finance-dashboard",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.finance]}>
          <FinanceHome />
        </ProtectedRoute>
      ),
    },
    {
      path: "recent-paid/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.finance]}>
          <RecentPaid />
        </ProtectedRoute>
      ),
    },
    {
      path: "/finance-profile",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.finance]}>
          <FinanceProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/finance-client",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.finance]}>
          <FinanceClient />
        </ProtectedRoute>
      ),
    },
    {
      path: "/myclients",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <MyClients />
        </ProtectedRoute>
      ),
    },
    {
      path: "/clientinfo",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <ClientInformation />
        </ProtectedRoute>
      ),
    },
    {
      path: "/viewteam",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <GetTeams />
        </ProtectedRoute>
      ),
    },
    {
      path: "/team-kyc",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <TeamKyc />
        </ProtectedRoute>
      ),
    },
    {
      path: "client-details/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <ClientDetailsKyc />
        </ProtectedRoute>
      ),
    },
    {
      path: "calander",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <PackageList />
        </ProtectedRoute>
      ),
    },
    {
      path: "packageservice/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <ServiceOfPackage />
        </ProtectedRoute>
      ),
    },
    {
      path: "openCalender/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <OpenCalendar />
        </ProtectedRoute>
      ),
    },
    {
      path: "setCalendar/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <SetCalendar />
        </ProtectedRoute>
      ),
    },
    {
      path: "teams",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <Teams />
        </ProtectedRoute>
      ),
    },
    {
      path: "package-request",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <PackageRequest />
        </ProtectedRoute>
      ),
    },
    {
      path: "package-verify/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <PackageVerify />
        </ProtectedRoute>
      ),
    },
    {
      path: "book-event",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <EventBooking />
        </ProtectedRoute>
      ),
    },
    {
      path: "/clientinfo/:id",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <ClientInformationTeamLead />
        </ProtectedRoute>
      ),
    },
    {
      path: "/bookingRequest",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <BookingRequest />
        </ProtectedRoute>
      ),
    },
    {
      path: "/upcoming-events",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <UpcomingEventsTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "/completed-events",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <CompletedEvents />
        </ProtectedRoute>
      ),
    },

    {
      path: "event-calendar",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <EventCalendarTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "assign-subteam",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <AssignSubteam />
        </ProtectedRoute>
      ),
    },
    {
      path: "subteam-members",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <Subteam />
        </ProtectedRoute>
      ),
    },
    {
      path: "subteam/:id",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.teamLead,
            PermissionType.businessHead,
          ]}
        >
          <SubTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "view-unitMembers/:id",
      element: (
        <ProtectedRoute
          requiredPermission={[
            PermissionType.teamLead,
            PermissionType.businessHead,
          ]}
        >
          <ViewTeam />
        </ProtectedRoute>
      ),
    },
    {
      path: "publish-report",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <PublishReport />
        </ProtectedRoute>
      ),
    },
    {
      path: "participant-data-history",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.teamLead]}>
          <ParticipantDataHistory />
        </ProtectedRoute>
      ),
    },

    //UnitCoordinator Route From Here
    {
      path: "assigned-events",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <Events />
        </ProtectedRoute>
      ),
    },
    {
      path: "events",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <Events2 />
        </ProtectedRoute>
      ),
    },
    {
      path: "event-details",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <EventDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "event-started",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <EventStarted />
        </ProtectedRoute>
      ),
    },
    {
      path: "event-completed",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <EventCompleted />
        </ProtectedRoute>
      ),
    },
    {
      path: "unit-profile",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <UnitProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "edit-unit-profile",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <EditUnitProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "my-team",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.unitCoordinator]}>
          <MyTeam />
        </ProtectedRoute>
      ),
    },

    {
      path: "/it-dashboard",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.ITteam]}>
          <IssuesList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/ticket-form",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.ITteam]}>
          <TicketForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/edit-issue",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.ITteam]}>
          <EditIssue />
        </ProtectedRoute>
      ),
    },

    {
      path: "/clients-list",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.sales]}>
          <ClientLists />
        </ProtectedRoute>
      ),
    },

    {
      path: "/lead-details",
      element: (
        <ProtectedRoute requiredPermission={[PermissionType.sales]}>
          <LeadDetails />
        </ProtectedRoute>
      ),
    },
    //
  ],
};
export default AuthRoute;
