import pool from "../config/db.js";

const seedFeedback = async () => {
    const query = `
        INSERT INTO feedbacks (
            tenant_id,
            branch_id,
            order_id,
            rating,
            comments
        )
        SELECT
            t.id,
            b.id,
            o.id,
            data.rating,
            data.comments
        FROM tenants t
        JOIN branches b
            ON b.tenant_id = t.id
        JOIN orders o
            ON o.branch_id = b.id
        CROSS JOIN (
            VALUES
                (5, 'Excellent food and service'),
                (4, 'Good experience'),
                (3, 'Food was okay')
        ) AS data(rating, comments)
        LIMIT 3;
    `;

    await pool.query(query);

    console.log("Feedback dummy data seeded successfully");

    await pool.end();
};

seedFeedback();

