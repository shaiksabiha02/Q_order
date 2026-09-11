export const up = (pgm) => {
    pgm.createTable("dining_tables", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
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

        floor_id: {
            type: "varchar(50)",
            notNull: true,
        },

        capacity: {
            type: "integer",
            notNull: true,
            default: 4,
        },

        qr_secret_token: {
            type: "varchar(255)",
            notNull: true,
        },

        status: {
            type: "varchar(20)",
            notNull: true,
            default: "VACANT",
        },

        created_at: {
            type: "timestamp with time zone",
            default: pgm.func("current_timestamp"),
        },

        updated_at: {
            type: "timestamp with time zone",
            default: pgm.func("current_timestamp"),
        },
    });

    pgm.addConstraint(
        "dining_tables",
        "dining_tables_status_check",
        {
            check: "status IN ('VACANT', 'OCCUPIED', 'BILL_REQUESTED')",
        }
    );

    pgm.addConstraint(
        "dining_tables",
        "unique_branch_floor_table",
        {
            unique: ["branch_id", "floor_id"],
        }
    );

    pgm.createIndex(
        "dining_tables",
        ["tenant_id"],
        {
            name: "idx_dining_tables_tenant",
        }
    );

    pgm.createIndex(
        "dining_tables",
        ["branch_id"],
        {
            name: "idx_dining_tables_branch",
        }
    );

    pgm.createIndex(
        "dining_tables",
        ["branch_id", "floor_id"],
        {
            name: "idx_dining_tables_floor",
        }
    );
};

export const down = (pgm) => {
    pgm.dropTable("dining_tables");
};