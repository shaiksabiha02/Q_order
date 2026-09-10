import pool from "../config/db.js";

const runSeeder = async () => {
    try {
        // Get existing tenants
        const tenantsResult = await pool.query(`
            SELECT id, company_name
            FROM tenants
            ORDER BY created_at ASC
            LIMIT 5;
        `);

        const tenants = tenantsResult.rows;

        if (tenants.length < 5) {
            console.log("Please create at least 5 tenants first.");
            return;
        }

        const branches = [
            {
                tenant_id: tenants[0].id,
                name: "Main Branch",
                address: "Madhapur, Hyderabad"
            },
            {
                tenant_id: tenants[1].id,
                name: "City Branch",
                address: "Kukatpally, Hyderabad"
            },
            {
                tenant_id: tenants[2].id,
                name: "Banjara Hills Branch",
                address: "Banjara Hills, Hyderabad"
            },
            {
                tenant_id: tenants[3].id,
                name: "Gachibowli Branch",
                address: "Gachibowli, Hyderabad"
            },
            {
                tenant_id: tenants[4].id,
                name: "Hitech City Branch",
                address: "Hitech City, Hyderabad"
            }
        ];

        for (const branch of branches) {

            const existingBranch = await pool.query(
                `
                SELECT id
                FROM branches
                WHERE tenant_id = $1
                AND name = $2;
                `,
                [
                    branch.tenant_id,
                    branch.name
                ]
            );

            if (existingBranch.rows.length > 0) {
                console.log(
                    `Branch already exists: ${branch.name}`
                );
                continue;
            }

            await pool.query(
                `
                INSERT INTO branches (
                    tenant_id,
                    name,
                    address,
                    timezone,
                    currency,
                    tax_rate
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    'Asia/Kolkata',
                    'INR',
                    5.00
                );
                `,
                [
                    branch.tenant_id,
                    branch.name,
                    branch.address
                ]
            );

            console.log(
                `Branch created: ${branch.name}`
            );
        }

        console.log("Branches seed completed successfully.");

    } catch (error) {
        console.error(
            "Error seeding branches:",
            error
        );
    } finally {
        await pool.end();
    }
};

runSeeder();