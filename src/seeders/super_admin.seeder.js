import bcrypt from "bcrypt";
import pool from "../config/db.js";

const createSuperAdmin = async () => {
    try {
        const password = "Admin@123";
        const password_hash = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO staff_users (
                username,
                password_hash,
                role
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (username)
            DO NOTHING
            RETURNING id, username, role, created_at;
        `;

        const result = await pool.query(query, [
            "superadmin",
            password_hash,
            "SUPER_ADMIN"
        ]);

        console.log("Super Admin created:", result.rows[0]);

    } catch (error) {
        console.error("Error creating Super Admin:", error);
    } finally {
        await pool.end();
    }
};

createSuperAdmin();