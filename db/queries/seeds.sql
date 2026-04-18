-- CUSTOMERS
INSERT INTO customers (id, username, password, first_name, last_name, email, phone_number, date_of_birth, gender, delivery_address, is_verified)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9e01', 'johndoe', '$argon2id$v=19$m=65536,t=2,p=4$R2N2ZVNrWVp0c3VQclFpVQ$FYapdTXyEfJoCyuXZz3I61lR7tmqbl0kFN5dlr4ACPk', 'John', 'Doe', 'john.doe@email.com', '0901234567', '1992-05-15', 'Male', '123 Maple St, Springfield', TRUE),
('018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9e02', 'janesmith', '$argon2id$v=19$m=65536,t=2,p=4$R2N2ZVNrWVp0c3VQclFpVQ$FYapdTXyEfJoCyuXZz3I61lR7tmqbl0kFN5dlr4ACPk', 'Jane', 'Smith', 'jane.smith@email.com', '0907654321', '1995-10-20', 'Female', '456 Oak Ave, Metropolis', TRUE),
('018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9e03', 'mike_brown', '$argon2id$v=19$m=65536,t=2,p=4$R2N2ZVNrWVp0c3VQclFpVQ$FYapdTXyEfJoCyuXZz3I61lR7tmqbl0kFN5dlr4ACPk', 'Mike', 'Brown', 'mike.b@email.com', '0901112223', '1988-12-02', 'Male', '789 Pine Rd, Gotham', FALSE),
('018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9999', 'test_customer', '$argon2id$v=19$m=65536,t=2,p=4$R2N2ZVNrWVp0c3VQclFpVQ$FYapdTXyEfJoCyuXZz3I61lR7tmqbl0kFN5dlr4ACPk', 'DinhKore', 'Test', 'test@example.com', '0999888777', '2000-01-01', 'Male', 'Ho Chi Minh City', TRUE);
-- STAFF
INSERT INTO staff (id, username, password, name, role)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-6a1b2c3d4e01', 'admin_one', '$argon2id$v=19$m=65536,t=2,p=4$R2N2ZVNrWVp0c3VQclFpVQ$FYapdTXyEfJoCyuXZz3I61lR7tmqbl0kFN5dlr4ACPk', 'Alice Johnson', 'admin'),
('018e9f2b-7c1a-7b3a-9e1d-6a1b2c3d4e02', 'barista_bob', '$argon2id$v=19$m=65536,t=2,p=4$R2N2ZVNrWVp0c3VQclFpVQ$FYapdTXyEfJoCyuXZz3I61lR7tmqbl0kFN5dlr4ACPk', 'Bob Wilson', 'barista'),
('018e9f2b-7c1a-7b3a-9e1d-6a1b2c3d9999', 'test_staff', '$argon2id$v=19$m=65536,t=2,p=4$R2N2ZVNrWVp0c3VQclFpVQ$FYapdTXyEfJoCyuXZz3I61lR7tmqbl0kFN5dlr4ACPk', 'Staff Tester', 'admin');
    
-- DRINK CATEGORIES
INSERT INTO drink_categories (id, name, description)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-7a1b2c3d4e01', 'Milk Tea', 'Classic creamy tea with various flavors'),
('018e9f2b-7c1a-7b3a-9e1d-7a1b2c3d4e02', 'Fruit Tea', 'Refreshing tea infused with fresh fruits'),
('018e9f2b-7c1a-7b3a-9e1d-7a1b2c3d4e03', 'Coffee', 'Energizing brewed coffee selections');

-- TOPPINGS
INSERT INTO toppings (id, name, image_url, unit_price, stock_quantity)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e01', 'Black Pearl', '/images/toppings/aloe-vera.jpg', 0.50, 500),
('018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e02', 'Grass Jelly', '/images/toppings/grass-jelly.jpg', 0.75, 200),
('018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e03', 'Cheese Foam', '/images/toppings/cheese-foam.jpg', 1.00, 100),
('018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e04', 'Aloe Vera', '/images/toppings/aloe-vera.jpg', 0.60, 150);

-- DRINKS
INSERT INTO drinks (id, name, description, category_id, image_url)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-9a1b2c3d4e01', 'Signature Milk Tea', 'Our best-selling house blend', '018e9f2b-7c1a-7b3a-9e1d-7a1b2c3d4e01', '/images/drinks/signature-milk-tea.jpg'),
('018e9f2b-7c1a-7b3a-9e1d-9a1b2c3d4e02', 'Peach Oolong Tea', 'Fragrant oolong with peach bits', '018e9f2b-7c1a-7b3a-9e1d-7a1b2c3d4e02', '/images/drinks/peach-oolong-tea.jpg'),
('018e9f2b-7c1a-7b3a-9e1d-9a1b2c3d4e03', 'Iced Latte', 'Espresso with chilled milk', '018e9f2b-7c1a-7b3a-9e1d-7a1b2c3d4e03', '/images/drinks/iced-latte.jpg');

-- DRINK VARIANTS
INSERT INTO drink_variants (id, drink_id, name, volume_ml, price, stock_quantity, is_default)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-9a1b2c3d4e01', 'Regular', 500, 4.50, 100, TRUE),
('018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e02', '018e9f2b-7c1a-7b3a-9e1d-9a1b2c3d4e01', 'Large', 700, 5.50, 80, FALSE),
('018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e03', '018e9f2b-7c1a-7b3a-9e1d-9a1b2c3d4e02', 'Standard', 500, 5.00, 150, TRUE),
('018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e04', '018e9f2b-7c1a-7b3a-9e1d-9a1b2c3d4e03', 'Tall', 350, 4.25, 200, TRUE);

-- ORDERS
INSERT INTO orders (id, customer_id, status, total_amount, payment_method, delivery_method, shipping_fee, delivery_address)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-1c1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9e01', 'completed', 11.25, 'credit_card', 'delivery', 2.00, '123 Maple St, Springfield'),
('018e9f2b-7c1a-7b3a-9e1d-1c1b2c3d4e02', '018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9e02', 'processing', 5.50, 'cash', 'pickup', 0.00, NULL);

-- ORDER ITEMS
INSERT INTO order_items (id, order_id, drink_variant_id, quantity, sugar_level, ice_level, calculated_price)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-2d1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-1c1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e01', 2, '50%', 'normal_ice', 9.25),
('018e9f2b-7c1a-7b3a-9e1d-2d1b2c3d4e02', '018e9f2b-7c1a-7b3a-9e1d-1c1b2c3d4e02', '018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e02', 1, '100%', 'no_ice', 5.50);

-- ORDER ITEM TOPPINGS
INSERT INTO order_item_toppings (order_item_id, topping_id, quantity)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-2d1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e01', 1),
('018e9f2b-7c1a-7b3a-9e1d-2d1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e03', 1);

-- CARTS
INSERT INTO carts (id, customer_id, created_at, updated_at)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-3e1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9e01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('018e9f2b-7c1a-7b3a-9e1d-3e1b2c3d4e02', '018e9f2b-7c1a-7b3a-9e1d-5a6b7c8d9e03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CART ITEMS
INSERT INTO cart_items (id, cart_id, drink_variant_id, quantity, sugar_level, ice_level, calculated_price)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-4f1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-3e1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e01', 1, '50%', 'less_ice', 5.50),
('018e9f2b-7c1a-7b3a-9e1d-4f1b2c3d4e02', '018e9f2b-7c1a-7b3a-9e1d-3e1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e03', 2, '75%', 'normal_ice', 10.00),
('018e9f2b-7c1a-7b3a-9e1d-4f1b2c3d4e03', '018e9f2b-7c1a-7b3a-9e1d-3e1b2c3d4e02', '018e9f2b-7c1a-7b3a-9e1d-0b1b2c3d4e02', 1, '100%', 'extra_ice', 6.10);

-- CART ITEM TOPPINGS
INSERT INTO cart_item_toppings (cart_item_id, topping_id, quantity)
VALUES 
('018e9f2b-7c1a-7b3a-9e1d-4f1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e01', 1), 
('018e9f2b-7c1a-7b3a-9e1d-4f1b2c3d4e01', '018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e03', 1), 
('018e9f2b-7c1a-7b3a-9e1d-4f1b2c3d4e03', '018e9f2b-7c1a-7b3a-9e1d-8a1b2c3d4e04', 1);