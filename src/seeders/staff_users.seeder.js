import pool from "../config/db.js";
import bcrypt from "bcrypt";

const runSeeder = async () => {
    try {
        // Get existing tenants and branches
        const result = await pool.query(`
            SELECT
                t.id AS tenant_id,
                b.id AS branch_id,
                t.company_name,
                b.name AS branch_name
            FROM tenants t
            INNER JOIN branches b
                ON b.tenant_id = t.id
            ORDER BY t.created_at ASC
            LIMIT 5;
        `);

        const data = result.rows;

        if (data.length < 5) {
            console.log(
                "Please create at least 5 tenants and branches first."
            );
            return;
        }

        // One known password for testing
        const passwordHash = await bcrypt.hash(
            "Admin@123",
            10
        );

        const users = [
            {
                tenant_id: data[0].tenant_id,
                branch_id: data[0].branch_id,
                username: "superadmin1",
                role: "SUPER_ADMIN"
            },
            {
                tenant_id: data[1].tenant_id,
                branch_id: data[1].branch_id,
                username: "storeadmin1",
                role: "STORE_ADMIN"
            },
            {
                tenant_id: data[2].tenant_id,
                branch_id: data[2].branch_id,
                username: "storeadmin2",
                role: "STORE_ADMIN"
            },
            {
                tenant_id: data[3].tenant_id,
                branch_id: data[3].branch_id,
                username: "waiter1",
                role: "WAITER"
            },
            {
                tenant_id: data[4].tenant_id,
                branch_id: data[4].branch_id,
                username: "kitchen1",
                role: "KITCHEN_STAFF"
            }
        ];

        for (const user of users) {

            const existingUser = await pool.query(
                `
                SELECT id
                FROM staff_users
                WHERE username = $1;
                `,
                [user.username]
            );

            if (existingUser.rows.length > 0) {
                console.log(
                    `User already exists: ${user.username}`
                );
                continue;
            }

            await pool.query(
                `
                INSERT INTO staff_users (
                    tenant_id,
                    branch_id,
                    username,
                    password_hash,
                    pin_code,
                    role
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                );
                `,
                [
                    user.tenant_id,
                    user.branch_id,
                    user.username,
                    passwordHash,
                    "1234",
                    user.role
                ]
            );

            console.log(
                `Staff user created: ${user.username}`
            );
        }

        console.log(
            "Staff users seed completed successfully."
        );

        console.log(
            "Password for all seeded users: Admin@123"
        );

    } catch (error) {
        console.error(
            "Error seeding staff users:",
            error
        );
    } finally {
        await pool.end();
    }
};

runSeeder();