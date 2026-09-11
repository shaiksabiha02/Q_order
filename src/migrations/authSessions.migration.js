export const up = (pgm) => {
    pgm.createTable("auth_sessions", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        staff_user_id: {
            type: "uuid",
            notNull: true,
            references: "staff_users",
            onDelete: "CASCADE",
        },

        refresh_token_hash: {
            type: "text",
            notNull: true,
        },

        expires_at: {
            type: "timestamp with time zone",
            notNull: true,
        },

        revoked_at: {
            type: "timestamp with time zone",
            default: null,
        },

        created_at: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });

    pgm.createIndex(
        "auth_sessions",
        ["staff_user_id"],
        {
            name: "idx_auth_sessions_staff_user",
        }
    );
};

export const down = (pgm) => {
    pgm.dropTable("auth_sessions");
};