import pool from "../config/db.js";

const query = `
INSERT INTO tenants (
    company_name,
    tax_identifier,
    status
)
SELECT
    data.company_name,
    data.tax_identifier,
    data.status
FROM (
    VALUES
        ('Q Order Technologies', 'TAX-QORDER-001', 'ACTIVE'),
        ('Sri Lakshmi Foods', 'TAX-SLF-002', 'ACTIVE'),
        ('Fresh Bite Restaurant', 'TAX-FBR-003', 'ACTIVE'),
        ('Urban Cafe', 'TAX-UC-004', 'ACTIVE'),
        ('Royal Spice Kitchen', 'TAX-RSK-005', 'ACTIVE')
) AS data(company_name, tax_identifier, status)
WHERE NOT EXISTS (
    SELECT 1
    FROM tenants t
    WHERE t.tax_identifier = data.tax_identifier
);
`;

const runSeeder = async () => {
    try {
        await pool.query(query);

        console.log("Tenants seed data inserted successfully");
    } catch (error) {
        console.error("Error seeding tenants:", error);
    } finally {
        await pool.end();
    }
};

runSeeder();