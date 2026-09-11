export const up = (pgm) => {
    pgm.createTable("guest_sessions", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        guest_id: {
            type: "uuid",
            notNull: true,
        },

        tenant_id: {
            type: "uuid",
            notNull: true,
            references: "tenants",
            onDelete: "CASCADE",
        },

        branch_id: {
            type: "uuid",
            notNull: true,
            references: "branches",
            onDelete: "CASCADE",
        },

        table_id: {
            type: "uuid",
            notNull: true,
            references: "dining_tables",
            onDelete: "CASCADE",
        },

        created_at: {
            type: "timestamp with time zone",
            default: pgm.func("current_timestamp"),
        },

        expires_at: {
            type: "timestamp with time zone",
            notNull: true,
        },
    });

    pgm.createIndex(
        "guest_sessions",
        ["guest_id"],
        {
            name: "idx_guest_sessions_guest",
        }
    );

    pgm.createIndex(
        "guest_sessions",
        ["table_id"],
        {
            name: "idx_guest_sessions_table",
        }
    );

    pgm.createIndex(
        "guest_sessions",
        ["branch_id"],
        {
            name: "idx_guest_sessions_branch",
        }
    );

    pgm.createIndex(
        "guest_sessions",
        ["tenant_id"],
        {
            name: "idx_guest_sessions_tenant",
        }
    );
};

export const down = (pgm) => {
    pgm.dropTable("guest_sessions");
};