
const db = require("../config/db");

// PUBLIC: Get contact information for the website
const getPublicSettings = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                platform_name,
                tagline,
                support_email,
                contact_phone,
                whatsapp_number,
                contact_address,
                city,
                country,
                business_hours,
                facebook_url,
                instagram_url,
                linkedin_url,
                website_url
             FROM platform_settings
             WHERE setting_id = 1
             LIMIT 1`
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Platform settings have not been configured"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Get public settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve platform settings"
        });
    }
};


// ADMIN: Get all platform contact settings
const getPlatformSettings = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT *
             FROM platform_settings
             WHERE setting_id = 1
             LIMIT 1`
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Platform settings not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Get platform settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve settings"
        });
    }
};


// ADMIN: Update platform contact settings
const updatePlatformSettings = async (req, res) => {
    try {
        const {
            platform_name,
            tagline,
            support_email,
            contact_phone,
            whatsapp_number,
            contact_address,
            city,
            country,
            business_hours,
            facebook_url,
            instagram_url,
            linkedin_url,
            website_url
        } = req.body;

        const values = {
            platform_name,
            tagline,
            support_email,
            contact_phone,
            whatsapp_number,
            contact_address,
            city,
            country,
            business_hours,
            facebook_url,
            instagram_url,
            linkedin_url,
            website_url
        };

        const limits = {
            platform_name: 100,
            tagline: 255,
            support_email: 150,
            contact_phone: 30,
            whatsapp_number: 30,
            contact_address: 255,
            city: 100,
            country: 100,
            business_hours: 255,
            facebook_url: 255,
            instagram_url: 255,
            linkedin_url: 255,
            website_url: 255
        };

        for (const [field, value] of Object.entries(values)) {
            if (value !== undefined && value !== null) {
                if (typeof value !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: `${field} must be text`
                    });
                }

                if (value.length > limits[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} is too long`
                    });
                }
            }
        }

        const email = (support_email || "").trim();

        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid support email"
            });
        }

        const urlFields = [
            "facebook_url",
            "instagram_url",
            "linkedin_url",
            "website_url"
        ];

        for (const field of urlFields) {
            const value = values[field];

            if (value && value.trim()) {
                try {
                    const url = new URL(value);

                    if (!["http:", "https:"].includes(url.protocol)) {
                        throw new Error("Invalid protocol");
                    }
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: `${field} must be a valid HTTP or HTTPS URL`
                    });
                }
            }
        }

        await db.query(
            `UPDATE platform_settings
             SET
                platform_name = ?,
                tagline = ?,
                support_email = ?,
                contact_phone = ?,
                whatsapp_number = ?,
                contact_address = ?,
                city = ?,
                country = ?,
                business_hours = ?,
                facebook_url = ?,
                instagram_url = ?,
                linkedin_url = ?,
                website_url = ?,
                updated_by = ?
             WHERE setting_id = 1`,
            [
                (platform_name || "LENEX").trim(),
                (tagline || "").trim() || null,
                email || null,
                (contact_phone || "").trim() || null,
                (whatsapp_number || "").trim() || null,
                (contact_address || "").trim() || null,
                (city || "").trim() || null,
                (country || "").trim() || null,
                (business_hours || "").trim() || null,
                (facebook_url || "").trim() || null,
                (instagram_url || "").trim() || null,
                (linkedin_url || "").trim() || null,
                (website_url || "").trim() || null,
                req.admin.admin_id
            ]
        );

        const [updated] = await db.query(
            `SELECT *
             FROM platform_settings
             WHERE setting_id = 1`
        );

        res.status(200).json({
            success: true,
            message: "Platform settings updated successfully",
            data: updated[0]
        });
    } catch (error) {
        console.error("Update platform settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update platform settings"
        });
    }
};

module.exports = {
    getPublicSettings,
    getPlatformSettings,
    updatePlatformSettings
};
