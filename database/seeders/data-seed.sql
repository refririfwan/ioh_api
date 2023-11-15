-- Insert sample data into users table
INSERT INTO users (
        id,
        name,
        email,
        password,
        remember_me_token,
        created_at,
        updated_at
    )
VALUES (
        1,
        'John Doe',
        'john@example.com',
        '$scrypt$n=16384,r=8,p=1$vC4DApblPvilaekBe2MCuw$M+ZBgygHTT0+DHLlaBEQaX2IunCE9CYO+YnXmL42IZh2h1Yqmgefs4h0CILTc5GfZ49LPPCP2Wu25cvJQRpAvg',
        NULL,
        NOW(),
        NOW()
    ),
    (
        2,
        'Jane Smith',
        'jane@example.com',
        '$scrypt$n=16384,r=8,p=1$vC4DApblPvilaekBe2MCuw$M+ZBgygHTT0+DHLlaBEQaX2IunCE9CYO+YnXmL42IZh2h1Yqmgefs4h0CILTc5GfZ49LPPCP2Wu25cvJQRpAvg',
        NULL,
        NOW(),
        NOW()
    ),
    (
        3,
        'Bob Johnson',
        'bob@example.com',
        '$scrypt$n=16384,r=8,p=1$vC4DApblPvilaekBe2MCuw$M+ZBgygHTT0+DHLlaBEQaX2IunCE9CYO+YnXmL42IZh2h1Yqmgefs4h0CILTc5GfZ49LPPCP2Wu25cvJQRpAvg',
        NULL,
        NOW(),
        NOW()
    );
-- Insert sampel data into user_customers table
INSERT INTO user_customers (
        user_id,
        first_name,
        last_name,
        phone,
        created_at,
        updated_at
    )
VALUES (1, 'John', 'Doe', '123-456-7890', NOW(), NOW()),
    (2, 'Jane', 'Smith', '987-654-3210', NOW(), NOW()),
    (
        3,
        'Bob',
        'Johnson',
        '555-123-4567',
        NOW(),
        NOW()
    );
-- Insert sample data into invoices table
INSERT INTO invoices (
        id,
        user_id,
        invoice_number,
        due_date,
        created_at,
        updated_at
    )
VALUES (
        1,
        1,
        'INV-20231115-123',
        '2023-11-16',
        NOW(),
        NOW()
    ),
    (
        2,
        1,
        'INV-20231115-124',
        '2023-11-18',
        NOW(),
        NOW()
    ),
    (
        3,
        1,
        'INV-20231115-125',
        '2023-11-20',
        NOW(),
        NOW()
    ),
    (
        4,
        1,
        'INV-20231115-126',
        '2023-11-22',
        NOW(),
        NOW()
    ),
    (
        5,
        1,
        'INV-20231115-127',
        '2023-11-24',
        NOW(),
        NOW()
    ),
    (
        6,
        2,
        'INV-20231115-456',
        '2023-11-18',
        NOW(),
        NOW()
    ),
    (
        7,
        2,
        'INV-20231115-457',
        '2023-11-20',
        NOW(),
        NOW()
    ),
    (
        8,
        2,
        'INV-20231115-458',
        '2023-11-22',
        NOW(),
        NOW()
    ),
    (
        9,
        2,
        'INV-20231115-459',
        '2023-11-24',
        NOW(),
        NOW()
    ),
    (
        10,
        2,
        'INV-20231115-460',
        '2023-11-26',
        NOW(),
        NOW()
    ),
    (
        11,
        3,
        'INV-20231115-789',
        '2023-11-20',
        NOW(),
        NOW()
    ),
    (
        12,
        3,
        'INV-20231115-790',
        '2023-11-22',
        NOW(),
        NOW()
    ),
    (
        13,
        3,
        'INV-20231115-791',
        '2023-11-24',
        NOW(),
        NOW()
    ),
    (
        14,
        3,
        'INV-20231115-792',
        '2023-11-26',
        NOW(),
        NOW()
    ),
    (
        15,
        3,
        'INV-20231115-793',
        '2023-11-28',
        NOW(),
        NOW()
    );
-- Insert sample data into invoice_items table
INSERT INTO invoice_items (
        id,
        invoice_id,
        item_name,
        quantity,
        price,
        created_at,
        updated_at
    )
VALUES (1, 1, 'Digital Camera', 1, 500, NOW(), NOW()),
    (2, 1, 'Tripod', 1, 80, NOW(), NOW()),
    (3, 1, 'Printer', 1, 150, NOW(), NOW()),
    (4, 2, 'Laptop', 2, 1000, NOW(), NOW()),
    (5, 2, 'Mouse', 1, 50, NOW(), NOW()),
    (6, 3, 'Monitor', 1, 300, NOW(), NOW()),
    (
        7,
        3,
        'External Hard Drive',
        2,
        200,
        NOW(),
        NOW()
    ),
    (8, 4, 'Wireless Keyboard', 1, 120, NOW(), NOW()),
    (9, 4, 'Desk Chair', 1, 150, NOW(), NOW()),
    (10, 5, 'USB-C Cable', 3, 15, NOW(), NOW()),
    (11, 6, 'Smartphone', 1, 800, NOW(), NOW()),
    (12, 6, 'Tablet', 2, 300, NOW(), NOW()),
    (13, 7, 'Wireless Earbuds', 1, 120, NOW(), NOW()),
    (14, 8, 'Gaming Mouse', 1, 70, NOW(), NOW()),
    (15, 8, 'Laptop Bag', 1, 50, NOW(), NOW()),
    (16, 9, 'HDMI Cable', 2, 10, NOW(), NOW()),
    (17, 10, 'Digital Watch', 1, 100, NOW(), NOW()),
    (18, 10, 'Printer Paper', 3, 20, NOW(), NOW()),
    (19, 11, 'Office Chair', 1, 200, NOW(), NOW()),
    (20, 11, 'External SSD', 2, 250, NOW(), NOW());
-- Update total_amount in invoices based on invoice_items
UPDATE invoices
SET total_amount = (
        SELECT SUM(price * quantity)
        FROM invoice_items
        WHERE invoice_id = invoices.id
    );