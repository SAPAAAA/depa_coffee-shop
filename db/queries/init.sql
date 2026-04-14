CREATE TYPE STAFF_ROLE AS ENUM ('admin', 'barista');
CREATE TYPE ORDER_STATUS AS ENUM ('pending', 'processing', 'completed', 'cancelled');
CREATE TYPE PAYMENT_METHOD AS ENUM ('cash', 'credit_card', 'mobile_payment');
CREATE TYPE DELIVERY_METHOD AS ENUM ('pickup', 'delivery');

CREATE TYPE SUGAR_LEVEL AS ENUM ('0%', '25%', '50%', '75%', '100%');
CREATE TYPE ICE_LEVEL AS ENUM ('no_ice', 'less_ice', 'normal_ice', 'extra_ice');

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(20),
    delivery_address TEXT,
    avatar VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role STAFF_ROLE NOT NULL
);

CREATE TABLE drink_categories (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE toppings (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0
);

CREATE TABLE drinks (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) DEFAULT NULL,
    category_id UUID REFERENCES drink_categories(id)
);

CREATE TABLE drink_variants (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    drink_id UUID REFERENCES drinks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    volume_ml INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    customer_id UUID REFERENCES customers(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ORDER_STATUS NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method PAYMENT_METHOD NOT NULL DEFAULT 'cash',
    delivery_method DELIVERY_METHOD NOT NULL DEFAULT 'pickup',
    shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    delivery_address TEXT DEFAULT NULL
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    drink_variant_id UUID REFERENCES drink_variants(id),
    quantity INT NOT NULL,
    sugar_level SUGAR_LEVEL NOT NULL DEFAULT '100%',
    ice_level ICE_LEVEL NOT NULL DEFAULT 'normal_ice',
    calculated_price DECIMAL(10,2)
);

CREATE TABLE order_item_toppings (
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    topping_id UUID REFERENCES toppings(id),
    PRIMARY KEY (order_item_id, topping_id)
);

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    drink_variant_id UUID REFERENCES drink_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    sugar_level VARCHAR(20),
    ice_level VARCHAR(20),
    calculated_price DECIMAL(10, 2)
);

CREATE TABLE cart_item_toppings (
    cart_item_id UUID REFERENCES cart_items(id) ON DELETE CASCADE,
    topping_id UUID REFERENCES toppings(id) ON DELETE CASCADE,
    PRIMARY KEY (cart_item_id, topping_id)
);