// import { lazy } from "react";
// import Loadable from "../components/Loadable";
// import ClientLayout from "../layout/ClientLayout";
// import MyProfile from "../pages/dashboard/MyProfile";
// import EditProfile from "../pages/dashboard/EditProfile";
// import Packages from "../pages/packages/Packages";
// import ViewPackages from "../pages/packages/ViewPackages";
// import KycApprove from "../pages/kyc/KycApprove";
// import MyKycStatus from "../pages/kyc/MyKycStatus";
// import KycPending from "../pages/kyc/KycPending";
// import KycStatus from "../pages/kyc/KycStatus";
// import Events from "../pages/Events/Events";
// import BookingDetails from "../pages/Events/BookingDetails";
// import Participants from "../pages/participants/Participants";
// import AddParticipants from "../pages/participants/AddParticipants";
// import EditParticipants from "../pages/participants/EditParticipants";
// import ParticipantSuccess from "../pages/participants/Edit";
// import AvailablePackage from "../pages/packages/AvailablePackage";
// import Service from "../pages/packages/Service";
// import Purchase from "../pages/packages/Purchase";
// import YourPackages from "../pages/packages/YourPackages";
// import BookCalendar from "../pages/Events/BookCalendar";
// import ViewMyBookings from "../pages/packages/ViewMyBookings";
// import Form from "../pages/Events/Form";

// const Home = Loadable(lazy(() => import("../Home")));
// const ClientRoutes = {
//   path: "/",
//   element: <ClientLayout />,

//   children: [
//     {
//       path: "/dashboard",
//       element: <Home />,
//     },
//     {
//       path: "/myprofile",
//       element: <MyProfile />,
//     },
//     {
//       path: "/editprofile",
//       element: <EditProfile />,
//     },
//     {
//       path: "/packages",
//       element: <Packages />,
//     },
//     {
//       path: "/view-packages/:id",
//       element: <ViewPackages />,
//     },
//     {
//       path: "/kyc",
//       element: <KycApprove />,
//     },

//     {
//       path: "/mykycstatus",
//       element: <MyKycStatus />,
//     },
//     {
//       path: "/kycpending",
//       element: <KycPending />,
//     },
//     {
//       path: "/kycstatus",
//       element: <KycStatus />,
//     },
//     {
//       path: "/events",
//       element: <Events />,
//     },
//     {
//       path: "/booking-details",
//       element: <BookingDetails />,
//     },
//     {
//       path: "/participants",
//       element: <Participants />,
//     },
//     {
//       path: "/add-new-participant",
//       element: <AddParticipants />,
//     },
//     {
//       path: "/edit-participants",
//       element: <EditParticipants />,
//     },
//     {
//       path: "/edit",
//       element: <ParticipantSuccess />,
//     },
//     {
//       path: "/availabe-package",
//       element: <AvailablePackage />,
//     },
//     {
//       path: "/package/:id",
//       element: <Service />,
//     },
//     {
//       path: "/purchase",
//       element: <Purchase />,
//     },
//     {
//       path: "/your-packages",
//       element: <YourPackages />,
//     },
//     {
//       path: "/book-event/:id",
//       element: <BookCalendar />,
//     },
//     ,
//     {
//       path: "/my-bookings/:id",
//       element: <ViewMyBookings />,
//     },
//     {
//       path: "/calender-form",
//       element: <Form />,
//     },
//   ],
// };

// export default ClientRoutes;


import { lazy } from "react";
import Loadable from "../components/Loadable";
import ClientLayout from "../layout/ClientLayout";
import MyProfile from "../pages/dashboard/MyProfile";
import EditProfile from "../pages/dashboard/EditProfile";
import Packages from "../pages/packages/Packages";
import ViewPackages from "../pages/packages/ViewPackages";
import KycApprove from "../pages/kyc/KycApprove";
import MyKycStatus from "../pages/kyc/MyKycStatus";
import KycStatus from "../pages/kyc/KycStatus";
import Events from "../pages/Events/Events";
import BookingDetails from "../pages/Events/BookingDetails";
import Participants from "../pages/participants/Participants";
import AddParticipants from "../pages/participants/AddParticipants";
import EditParticipants from "../pages/participants/EditParticipants";
import ParticipantSuccess from "../pages/participants/Edit";
import AvailablePackage from "../pages/packages/AvailablePackage";
import Service from "../pages/packages/Service";
import Purchase from "../pages/packages/Purchase";
import YourPackages from "../pages/packages/YourPackages";
import BookCalendar from "../pages/Events/BookCalendar";
import ViewMyBookings from "../pages/packages/ViewMyBookings";
import Form from "../pages/Events/Form";
import CompletedEvents from "../pages/reports/CompletedEvents";
import ViewReport from "../pages/reports/ViewReport";
import BookingStatus from "../pages/Events/BookingStatus";
import AddEventParticipants from "../pages/participants/AddEventParticipants";
import EnrollParticipants from "../pages/participants/EnrollParticipants";
import KycEdit from "../pages/kyc/KycEdit";
import KycDetails from "../pages/kyc/KycDetails";

const Home = Loadable(lazy(() => import("../Home")));

const ClientRoutes = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { path: "/dashboard", element: <Home /> },
    { path: "/myprofile", element: <MyProfile /> },
    { path: "/editprofile", element: <EditProfile /> },
    { path: "/packages", element: <Packages /> },
    { path: "/view-packages/:id/:enrollId", element: <ViewPackages /> },
    { path: "/kyc", element: <KycApprove /> },
    { path: "/mykycstatus", element: <MyKycStatus /> },
    { path: "/kyc-details", element: <KycDetails /> },
    { path: "/kycstatus", element: <KycStatus /> },
    { path: "/kyc-edit", element: <KycEdit /> },
    { path: "/events", element: <Events /> },
    { path: "/booking-details", element: <BookingDetails /> },
    { path: "/participants", element: <Participants /> },
    { path: "/add-new-participant", element: <AddParticipants /> },
    { path: "/edit-participants", element: <EditParticipants /> },
    { path: "/edit", element: <ParticipantSuccess /> },
    { path: "/availabe-package", element: <AvailablePackage /> },
    { path: "/package/:id", element: <Service /> },
    { path: "/purchase", element: <Purchase /> },
    { path: "/your-packages", element: <YourPackages /> },
    { path: "/book-event/:id", element: <BookCalendar /> },
    { path: "/my-bookings/:id/:enrollId", element: <ViewMyBookings /> },
    { path: "/calender-form", element: <Form /> },
    {path: '/report', element: <CompletedEvents/>},
    {path: '/view-report', element: <ViewReport/>},
    {path: '/booking-status', element: <BookingStatus/>},
    {path: '/add-event-participants', element: <AddEventParticipants/>},
    {path: '/enroll-participants', element: <EnrollParticipants/>}
  ],
};

export default ClientRoutes;