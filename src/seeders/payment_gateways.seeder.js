import pool from "../config/db.js";

const runSeeder = async () => {
    try {
        // Get existing tenants
        const result = await pool.query(`
            SELECT id, company_name
            FROM tenants
            ORDER BY created_at ASC
            LIMIT 5;
        `);

        const tenants = result.rows;

        if (tenants.length < 5) {
            console.log("Please create at least 5 tenants first.");
            return;
        }

        const gateways = [
            {
                tenant_id: tenants[0].id,
                gateway_name: "RAZORPAY",
                gateway_account_id: "razorpay_account_001",
                api_key: "test_api_key_001",
                secret_key: "test_secret_key_001"
            },
            {
                tenant_id: tenants[1].id,
                gateway_name: "STRIPE",
                gateway_account_id: "stripe_account_002",
                api_key: "test_api_key_002",
                secret_key: "test_secret_key_002"
            },
            {
                tenant_id: tenants[2].id,
                gateway_name: "RAZORPAY",
                gateway_account_id: "razorpay_account_003",
                api_key: "test_api_key_003",
                secret_key: "test_secret_key_003"
            },
            {
                tenant_id: tenants[3].id,
                gateway_name: "STRIPE",
                gateway_account_id: "stripe_account_004",
                api_key: "test_api_key_004",
                secret_key: "test_secret_key_004"
            },
            {
                tenant_id: tenants[4].id,
                gateway_name: "RAZORPAY",
                gateway_account_id: "razorpay_account_005",
                api_key: "test_api_key_005",
                secret_key: "test_secret_key_005"
            }
        ];

        for (const gateway of gateways) {

            const existingGateway = await pool.query(
                `
                SELECT id
                FROM payment_gateways
                WHERE tenant_id = $1
                AND gateway_name = $2;
                `,
                [
                    gateway.tenant_id,
                    gateway.gateway_name
                ]
            );

            if (existingGateway.rows.length > 0) {
                console.log(
                    `Gateway already exists for tenant: ${gateway.gateway_name}`
                );
                continue;
            }

            await pool.query(
                `
                INSERT INTO payment_gateways (
                    tenant_id,
                    gateway_name,
                    gateway_account_id,
                    api_key,
                    secret_key,
                    status
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    'ACTIVE'
                );
                `,
                [
                    gateway.tenant_id,
                    gateway.gateway_name,
                    gateway.gateway_account_id,
                    gateway.api_key,
                    gateway.secret_key
                ]
            );

            console.log(
                `Payment gateway created: ${gateway.gateway_name}`
            );
        }

        console.log(
            "Payment gateways seed completed successfully."
        );

    } catch (error) {
        console.error(
            "Error seeding payment gateways:",
            error
        );
    } finally {
        await pool.end();
    }
};

runSeeder();