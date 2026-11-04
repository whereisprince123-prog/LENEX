const bcrypt = require("bcryptjs");
const readline = require("readline");
const db = require("./../src/config/db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function createAdmin() {
    try {
        const fullName = (await ask("Full name: ")).trim();
        const email = (await ask("Admin email: "))
            .trim()
            .toLowerCase();
        const password = await ask("Admin password (minimum 8 characters): ");

        if (!fullName || !email || password.length < 8) {
            throw new Error(
                "Enter a name, valid email, and password of at least 8 characters."
            );
        }

        const [existing] = await db.query(
            "SELECT admin_id FROM admins WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            throw new Error("An admin with this email already exists.");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await db.query(
            `INSERT INTO admins
                (full_name, email, password_hash, role, is_active)
             VALUES (?, ?, ?, ?, ?)`,
            [fullName, email, passwordHash, "SUPER_ADMIN", 1]
        );

        console.log("\nAdmin account created successfully!");
        console.log("Admin ID:", result.insertId);
        console.log("Email:", email);
        console.log("Role: SUPER_ADMIN");
        console.log("Status: Active");
    } catch (error) {
        console.error("\nFailed to create admin:", error.message);
    } finally {
        rl.close();
        await db.end();
    }
}

createAdmin();