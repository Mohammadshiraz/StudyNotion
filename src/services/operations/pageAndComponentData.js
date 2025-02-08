import { toast } from "react-hot-toast";
import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

export const getCatalogaPageData = async (categoryId, dispatch) => {
    dispatch(setProgress(50));
    let result = [];

    try {
        // Check API URL
        if (!catalogData.CATALOGPAGEDATA_API) {
            console.error("❌ API URL is undefined!");
            toast.error("API URL is missing!");
            dispatch(setProgress(100));
            return;
        }

        // Check if categoryId is valid
        if (!categoryId) {
            console.error("❌ categoryId is missing!");
            toast.error("Invalid category. Please select a valid category.");
            dispatch(setProgress(100));
            return;
        }

        console.log("✅ API URL:", catalogData.CATALOGPAGEDATA_API);
        console.log("📨 Request Payload:", { categoryId });

        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {
            categoryId: categoryId,
        });

        console.log("📩 CATALOG PAGE DATA API RESPONSE:", response?.data);

        if (!response?.data?.success) {
            throw new Error("Could not fetch category page data: " + JSON.stringify(response.data));
        }

        result = response?.data;
    } catch (error) {
        console.log("❌ API URL:", catalogData.CATALOGPAGEDATA_API);
        console.log("🚨 CATALOG PAGE DATA API ERROR:", error?.response?.data || error);

        toast.error("No Course added to this category yet");

        result = error.response?.data || { success: false, message: "Unknown error occurred" };
    }

    dispatch(setProgress(100));
    return result;
};
