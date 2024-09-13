import Joi from "joi";

// Joi schema for GeoLocation
export const GeoLocationSchema = Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).ordered().length(2).required(),
});

// Joi schema before finding place without country from pincode
export const ToFindPlacesSchema = Joi.object({
    Pincode: Joi.string().required(),
    AddressLine1: Joi.string().required().empty(),
});

// Joi schema before finding place from pincode
export const ToFindPlacesWithCountrySchema = Joi.object({
    Pincode: ToFindPlacesSchema.extract("Pincode"),
    AddressLine1: ToFindPlacesSchema.extract("AddressLine1"),
    Country: Joi.string().required(),
});

// Joi schema for PostalDetails
export const PostalDetailsSchema = Joi.object({
    Pincode: ToFindPlacesSchema.extract("Pincode"),
    District: Joi.string().required().empty(),
    State: Joi.string().required().empty(),
});

// Joi schema for AddressDetails
export const AddressDetailsSchema = PostalDetailsSchema.keys({
    AddressLine1: ToFindPlacesSchema.extract("AddressLine1"),
});

// Joi schema for AddressDetails with country
export const AddressDetailsWithCountrySchema = AddressDetailsSchema.keys({
    Country: ToFindPlacesWithCountrySchema.extract("Country"),
});

// Joi schema for AddressDetails
export const CustomFieldSchema = Joi.object({
    FieldName: Joi.string(),
    FieldDescription: Joi.string(),
}).required();


// Joi schema for LocationDetails
export const LocationDetailsSchema = AddressDetailsSchema.keys({
    GeoLocation: GeoLocationSchema.required(),
});


// Joi schema for LocationDetails withCountry
export const LocationDetailsWithCountrySchema = AddressDetailsWithCountrySchema.keys({
    GeoLocation: GeoLocationSchema.required(),
});
