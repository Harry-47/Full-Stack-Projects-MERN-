export const CATEGORIES = [
    "Electronics", "Beauty & Care", "Groceries", "Mobiles", "Clothing", 
    "Laptops", "Books", "Accessories", "Home & Garden", "Sports", 
    "Cycling", "Toys & Games", "Footwear", "Baby Products", "Outdoor Gear"
];

export const formatProductPayload = (formData) => {
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== "") {
            dataToSend.append(key, formData[key]);
        }
    });
    return dataToSend;
};