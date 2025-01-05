import express from "express";
import {
  addCountry,
  addDistrict,
  addLocation,
  addMunicipality,
  addState,
  deleteCountry,
  deleteDistrict,
  deleteLocation,
  deleteMunicipality,
  deleteState,
  getCountry,
  getDistrict,
  getLocation,
  getLocationDetails,
  getMunicipality,
  getState,
  importBhaktapur,
  importLalitpur,
  importUData,
  updateLocation,
} from "../../controllers/Location/location";
import upload from "../../middleware/fileUpload";

const router = express.Router();

router.post("/addlocation", addLocation);
router.get("/getlocation", getLocation);
router.get("/getlocationdetails/:id", getLocationDetails);
router.put("/updatelocation/:id", updateLocation);
router.delete("/deletelocation", deleteLocation);

router.post("/addcountry", addCountry);
router.get("/getcountry", getCountry);
router.delete("/deletecountry/:id", deleteCountry);

router.post("/addstate", addState);
router.get("/getstate", getState);
router.delete("/deletestate/:id", deleteState);

router.post("/adddistrict", addDistrict);
router.get("/getdistrict", getDistrict);
router.delete("/deletedistrict/:id", deleteDistrict);

router.post("/addmunicipality", addMunicipality);
router.get("/getmunicipality", getMunicipality);
router.delete("/deletemunicipality/:id", deleteMunicipality);
router.post("/importkathmandu", upload.single("file"), importUData);
router.post("/importlalitpur", upload.single("file"), importLalitpur);
router.post("/importBhaktapur", upload.single("file"), importBhaktapur);

export default router;
