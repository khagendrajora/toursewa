import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateCategory from "./pages/admin/components/category/businessCategory/CreateCategory";
import BusinessProfile from "./pages/admin/components/business/BusinessProfile";
import { AddAdmin } from "./pages/admin/AddAdmin";
import { ResetPwd } from "./pages/passwordReset/ResetPwd";
import { BusinessReset } from "./pages/passwordReset/BusinessReset";
import { Vehicle } from "./pages/admin/components/vehicle/Vehicle";
import Treck from "./pages/admin/components/trek/Treck";
import Property from "./pages/admin/components/property/Property";
import { ManageProperty } from "./pages/admin/components/property/ManageProperty";
import { PropertyDetail } from "./pages/admin/components/property/PropertyDetail";
import { TourDetail } from "./pages/admin/components/tour/TourDetail";
import VehDetails from "./pages/admin/components/vehicle/VehDetails";
import { MAnageTreck } from "./pages/admin/components/trek/MAnageTreck";
import { TrekDetails } from "./pages/admin/components/trek/TrekDetails";
import { Layout } from "./pages/landingPage/components/Layout";
import LandingPage from "./pages/landingPage/LandingPage";
import VehReservation from "./pages/ReservationForm/VehReservation";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
// import { AdminLayout } from "./pages/admin/AdminLayout";
import { Profile } from "./pages/business/Profile";
import { Dashboard } from "./pages/business/Dashboard";
import { BusinessLayout } from "./pages/business/layout/BusinessLayout";
import { Login } from "./pages/Register/Login";
import { GetVeh } from "./pages/business/vehicle/GetVeh";
import { useAuthContext } from "./context/AuthContext";
import { GetTour } from "./pages/business/tour/GetTour";
import { GetTreck } from "./pages/business/trek/GetTreck";
import { RegisterBusiness } from "./pages/Register/RegisterBusiness";
import { VerifyBusinessEmail } from "./pages/Register/VerifyBusinessEmail";
import { ManageSubcategory } from "./pages/admin/components/subcategory/ManageSubcategory";

import { VehiclePage } from "./pages/landingPage/VehiclePage";
import { RegisterUser } from "./pages/Register/RegisterUser";

import { GetBlogs } from "./pages/admin/components/blogs/GetBlogs";
import { Business } from "./pages/admin/components/business/Business";
import { GetDestination } from "./pages/admin/components/destination/GetDestination";
import GetHero from "./pages/admin/components/hero/GetHero";
import { Tours } from "./pages/admin/components/tour/Tours";
import Vehicles from "./pages/admin/components/vehicle/Vehicles";
import { AddHotDeals } from "./pages/admin/components/aboutUs/AddHotDeals";
import { AddDest } from "./pages/admin/components/destination/AddDest";
import { AddHero } from "./pages/admin/components/hero/AddHero";
import Tour from "./pages/admin/components/tour/Tour";
import { ClientReset } from "./pages/passwordReset/ClientReset";
import { VehicleDetailsPage } from "./pages/landingPage/productDetailPage/VehicleDetailsPage";
import { Teams } from "./pages/admin/components/teams/Teams";
import { Reservations } from "./pages/business/reservations/Reservations";
import { ApproveBusiness } from "./pages/Register/ApproveBusiness";
import { AddDriver } from "./pages/business/drivers/AddDriver";
import { DriverReset } from "./pages/passwordReset/DriverReset";
import { VerifyDriverEmail } from "./pages/Register/VerifyDriverEmail";
import { GetDrivers } from "./pages/business/drivers/GetDrivers";
import { AdminLogin } from "./pages/Register/AdminLogin";
import { VerifyUser } from "./pages/Register/VerifyUser";
import { ClientDashboard } from "./pages/clientPage/ClientDashboard";
import { ClientProfile } from "./pages/clientPage/ClientProfile";
import { DriverDashboard } from "./pages/Driver/DriverDashboard";
import { DriverProfile } from "./pages/Driver/DriverProfile";
import { UpdateDriverProfile } from "./pages/Driver/UpdateDriverProfile";
import { UpdateBusiness } from "./pages/admin/components/business/UpdateBusiness";
import { UpdateBusinessProfile } from "./pages/business/UpdateBusinessProfile";
import { AddVehicle } from "./pages/business/vehicle/AddVehicle";
import { UpdateVehicle } from "./pages/business/vehicle/UpdateVehicle";
import { UpdateVeh } from "./pages/admin/components/vehicle/UpdateVeh";
import { UpdateBlogs } from "./pages/admin/components/blogs/UpdateBlogs";
import { UpdateHotDeals } from "./pages/admin/components/aboutUs/UpdateHotDeals";
import { UpdateDestination } from "./pages/admin/components/destination/UpdateDestination";
import { UpdateTour } from "./pages/admin/components/tour/UpdateTour";
import { UpdateTrek } from "./pages/admin/components/trek/UpdateTrek";
import { TourPage } from "./pages/landingPage/TourPage";
import { TourDetailPage } from "./pages/landingPage/productDetailPage/TourDetailPage";
import { AddBlogs } from "./pages/admin/components/blogs/addBlogs";
import ManageCategory from "./pages/admin/components/category/businessCategory/ManageCategory";
import { CreateSubCategory } from "./pages/admin/components/category/businessCategory/CreateSubCategory";
import UpdateCategory from "./pages/admin/components/category/businessCategory/UpdateCategory";
import AddTourCategory from "./pages/admin/components/category/tourCategory/AddTourCategory";
import GetTourCat from "./pages/admin/components/category/tourCategory/GetTourCat";
import AddTourSubCat from "./pages/admin/components/category/tourCategory/AddTourSubCat";
import UpdateTourCategory from "./pages/admin/components/category/tourCategory/UpdateTourCategory";
import AddTrekCat from "./pages/admin/components/category/trekCategory/AddTrekCat";
import GetTrekCat from "./pages/admin/components/category/trekCategory/GetTrekCat";
import AddTrekSubCat from "./pages/admin/components/category/trekCategory/AddTrekSubCat";
import UpdateTrekCat from "./pages/admin/components/category/trekCategory/UpdateTrekCat";
import AddVehCat from "./pages/admin/components/category/vehicleCategory/AddVehCat";
import GetVehCat from "./pages/admin/components/category/vehicleCategory/GetVehCat";
import AddVehSubCat from "./pages/admin/components/category/vehicleCategory/AddVehSubCat";
import UpdateVehCat from "./pages/admin/components/category/vehicleCategory/UpdateVehCat";
import AddTour from "./pages/business/tour/AddTour";
import UpdateBusinessTour from "./pages/business/tour/UpdateBusinessTour";
import UpdateBusinessTrek from "./pages/business/trek/UpdateBusinessTrek";
import { ForgetPwd } from "./pages/passwordReset/ForgetPwd";
import ResetAndVerify from "./pages/passwordReset/ResetAndVerify";
import GetLocation from "./pages/admin/components/location/Location/GetLocation";
import UpdateLocation from "./pages/admin/components/location/Location/UpdateLocation";
import { CountryList } from "./pages/admin/components/location/Country/CountryList";
import { StateList } from "./pages/admin/components/location/State/StateList";
import { MunicipalityList } from "./pages/admin/components/location/Municipality/MunicipalityList";

import { AddMunicipality } from "./pages/admin/components/location/Municipality/AddMunicipality";
import { AddState } from "./pages/admin/components/location/State/AddState";
import AddLocation from "./pages/admin/components/location/Location/AddLocation";
import AddTrek from "./pages/business/trek/AddTrek";
import VehicleDetail from "./pages/business/vehicle/VehicleDetail";
import { TrekDetailPage } from "./pages/landingPage/productDetailPage/TrekDetailPage";
import { TrekPage } from "./pages/landingPage/TrekPage";
import { DistrictList } from "./pages/admin/components/location/District/DistrictList";
import { AddDistrict } from "./pages/admin/components/location/District/AddDistrict";
import { UpdateProperty } from "./pages/admin/components/property/UpdateProperty";
import { DriverList } from "./pages/admin/components/drivers/DriverList";
import { ResetDriverAndVerify } from "./pages/passwordReset/ResetDriverAndVerify";
import { TrekInfo } from "./pages/business/trek/TrekInfo";
import { TourInfo } from "./pages/business/tour/TourInfo";
import { UpdateDriver } from "./pages/business/drivers/UpdateDriver";

import { TourReservations } from "./pages/business/reservations/TourReservations";
import { TrekReservations } from "./pages/business/reservations/TrekReservations";
import { VehicleInfo } from "./pages/Driver/VehicleInfo";
import { HotDealsPage } from "./pages/landingPage/HotDealsPage";
import { UpdateHero } from "./pages/admin/components/hero/UpdateHero";
import { DestinationPage } from "./pages/landingPage/DestinationPage";
import { AdminSideBar } from "./pages/admin/AdminSideBar";

function App() {
  const { authUser } = useAuthContext();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="admin" element={<AdminSideBar />}>
            {authUser?.userId ? (
              <>
                <Route path="admindashboard" element={<AdminDashboard />} />
                <Route path="addadmin" element={<AddAdmin />} />
                <Route path="driver" element={<DriverList />} />

                <Route path="blogs" element={<GetBlogs />} />
                <Route path="teams" element={<Teams />} />
                <Route path="business" element={<Business />} />
                <Route path="country" element={<CountryList />} />
                <Route path="state" element={<StateList />} />
                <Route path="municipality" element={<MunicipalityList />} />
                <Route path="district" element={<DistrictList />} />

                <Route path="district/adddistrict" element={<AddDistrict />} />
                <Route
                  path="municipality/addmunicipality"
                  element={<AddMunicipality />}
                />
                <Route path="state/addstate" element={<AddState />} />
                <Route path="locations" element={<GetLocation />} />
                <Route
                  path="locations/updatelocation/:id"
                  element={<UpdateLocation />}
                />
                <Route path="locations/addlocation" element={<AddLocation />} />
                <Route
                  path="business/businessprofile/:businesId"
                  element={<BusinessProfile />}
                />
                <Route
                  path="business/updatebusiness/:id"
                  element={<UpdateBusiness />}
                />

                <Route path="businesscategory" element={<ManageCategory />} />
                <Route path="destination" element={<GetDestination />} />
                <Route path="hero" element={<GetHero />} />
                <Route path="updatehero/:id" element={<UpdateHero />} />
                <Route path="property" element={<ManageProperty />} />

                <Route path="tour" element={<Tours />} />
                <Route path="trek" element={<MAnageTreck />} />
                <Route path="vehicle" element={<Vehicles />} />
                <Route
                  path="vehicle/updatevehicle/:id"
                  element={<UpdateVeh />}
                />
                <Route path="addtour" element={<Tour />} />
                <Route path="tour/updatetour/:id" element={<UpdateTour />} />
                <Route path="trek/updatetrek/:id" element={<UpdateTrek />} />
                <Route path="addtrek" element={<Treck />} />
                <Route path="addveh" element={<Vehicle />} />
                <Route path="vehicle/vehdetails/:id" element={<VehDetails />} />
                <Route path="tour/tourdetails/:id" element={<TourDetail />} />
                <Route path="trek/trekdetails/:id" element={<TrekDetails />} />
                <Route
                  path="property/updateproperty/:id"
                  element={<UpdateProperty />}
                />

                <Route
                  path="property/propertydetail/:id"
                  element={<PropertyDetail />}
                />
                <Route
                  path="businesscategory/addcategory"
                  element={<CreateCategory />}
                />
                <Route
                  path="businesscategory/addbusinesssubcategory/:id"
                  element={<CreateSubCategory />}
                />
                <Route path="blogs/addblogs" element={<AddBlogs />} />
                <Route path="addhotdeals" element={<AddHotDeals />} />
                <Route
                  path="destination/adddestinations"
                  element={<AddDest />}
                />
                <Route path="addhero" element={<AddHero />} />
                <Route path="property/addproperty" element={<Property />} />

                <Route path="addbusiness" element={<RegisterBusiness />} />
                <Route
                  path="businesscategory/updatecategory/:id"
                  element={<UpdateCategory />}
                />
                <Route path="updateblogs/:id" element={<UpdateBlogs />} />

                <Route path="updatehotdeals/:id" element={<UpdateHotDeals />} />
                <Route
                  path="updatedestination/:id"
                  element={<UpdateDestination />}
                />

                <Route
                  path="tourcategory/addtourcategory"
                  element={<AddTourCategory />}
                />
                <Route path="tourcategory" element={<GetTourCat />} />

                <Route
                  path="tourcategory/addsubcategory/:id"
                  element={<AddTourSubCat />}
                />
                <Route
                  path="tourcategory/updattourcategory/:id"
                  element={<UpdateTourCategory />}
                />

                <Route
                  path="trekcategory/addtrekcategory"
                  element={<AddTrekCat />}
                />
                <Route path="trekcategory" element={<GetTrekCat />} />

                <Route
                  path="trekcategory/addsubcategory/:id"
                  element={<AddTrekSubCat />}
                />
                <Route
                  path="trekcategory/updattrekcategory/:id"
                  element={<UpdateTrekCat />}
                />

                <Route
                  path="vehcategory/adddvehcategory"
                  element={<AddVehCat />}
                />
                <Route path="vehcategory" element={<GetVehCat />} />

                <Route
                  path="vehcategory/addsubcategory/:id"
                  element={<AddVehSubCat />}
                />
                <Route
                  path="vehcategory/updatvehcategory/:id"
                  element={<UpdateVehCat />}
                />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Route>

          <Route path="business" element={<BusinessLayout />}>
            {authUser?.bId ? (
              <>
                <Route
                  path="businessdashboard/:businessId"
                  element={<Dashboard />}
                />
                <Route
                  path="businessprofile/:businesId"
                  element={<Profile />}
                />
                <Route
                  path="updatebusinessprofile/:id"
                  element={<UpdateBusinessProfile />}
                />

                <Route path="vehicle" element={<GetVeh />} />
                <Route
                  path="vehicle/updateVehicle/:id"
                  element={<UpdateVehicle />}
                />
                <Route
                  path="vehicle/vehicledetail/:id"
                  element={<VehicleDetail />}
                />
                <Route path="tour" element={<GetTour />} />
                <Route
                  path="tour/updatebusinesstour/:id"
                  element={<UpdateBusinessTour />}
                />
                <Route path="tour/addtour" element={<AddTour />} />
                <Route path="trek" element={<GetTreck />} />
                <Route path="trek/addtrek" element={<AddTrek />} />
                <Route path="trek/trekdetails/:id" element={<TrekInfo />} />
                <Route path="tour/tourdetails/:id" element={<TourInfo />} />
                <Route
                  path="trek/updatebusinesstrek/:id"
                  element={<UpdateBusinessTrek />}
                />
                <Route path="reservations" element={<Reservations />} />
                <Route path="tourrev" element={<TourReservations />} />
                <Route path="trekrev" element={<TrekReservations />} />
                <Route path="vehicle/adddriver/:id" element={<AddDriver />} />
                <Route path="drivers/adddriver" element={<AddDriver />} />
                <Route path="drivers" element={<GetDrivers />} />
                <Route
                  path="drivers/updatedriver/:id"
                  element={<UpdateDriver />}
                />
                <Route path="vehicle/addvehicle" element={<AddVehicle />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Route>

          <Route
            path="/verifybusinessemail/:token"
            element={<VerifyBusinessEmail />}
          />
          <Route
            path="/verifydriveremail/:token"
            element={<VerifyDriverEmail />}
          />
          <Route path="/verifyemail/:token" element={<VerifyUser />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="businessapprove/:id" element={<ApproveBusiness />} />

          <Route path="" element={<Layout />}>
            <Route index element={<LandingPage />} />
            {!authUser ? (
              <>
                <Route path="login" element={<Login />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="" />} />
            )}

            {authUser?.clientId ? (
              <>
                <Route path="clientdashboard" element={<ClientDashboard />} />
                <Route path="clientprofile" element={<ClientProfile />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}

            <Route path="addclient" element={<RegisterUser />} />

            <Route path="resetuserpwd/:token" element={<ClientReset />} />
            <Route path="destinationpage" element={<DestinationPage />} />
            <Route path="addbusiness" element={<RegisterBusiness />} />
            <Route path="hotdeals" element={<HotDealsPage />} />

            <Route path="resetpwd/:token" element={<ResetPwd />} />
            {authUser?.driverId ? (
              <>
                <Route path="driverdashboard" element={<DriverDashboard />} />
                <Route path="driverprofile" element={<DriverProfile />} />
                <Route
                  path="updatedriverprofile/:id"
                  element={<UpdateDriverProfile />}
                />
                <Route
                  path="driver/vehicleinfo/:id"
                  element={<VehicleInfo />}
                />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}

            <Route path="/vehiclelist" element={<VehiclePage />} />
            <Route path="/trekpage" element={<TrekPage />} />
            <Route path="/tourpage" element={<TourPage />} />

            <Route
              path="/tourpage/tourdetails/:id"
              element={<TourDetailPage />}
            />
            <Route
              path="/trekpage/trekdetails/:id"
              element={<TrekDetailPage />}
            />

            {authUser && (
              <Route path="/reservationform/:id" element={<VehReservation />} />
            )}

            <Route
              path="/vehiclelist/vehicledetails/:id"
              element={<VehicleDetailsPage />}
            />

            <Route path="/addtrek" element={<Treck />} />

            <Route path="/subcategory" element={<ManageSubcategory />} />

            <Route path="/forgetpwd" element={<ForgetPwd />} />

            <Route
              path="/resetbusinesspwd/:token"
              element={<BusinessReset />}
            />
            <Route path="/resetandverify/:token" element={<ResetAndVerify />} />
            <Route
              path="/resetandverifyemail/:token"
              element={<ResetDriverAndVerify />}
            />
            <Route path="/resetdriverpwd/:token" element={<DriverReset />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
