INSERT INTO "products_categories" (name)
VALUES ('Hortaliças fruto'),
       ('Hortaliças tuberosas'),
       ('Hortaliças herbáceas');

INSERT INTO "products" (name, alias, category)
VALUES ('pepino', '{}', 1),
       ('pimenta', '{}', 1),
       ('pimentão', '{}', 1),
       ('quiabo', '{}', 1),
       ('batata', '{}', 2),
       ('batata-doce', '{}', 2),
       ('mandioquinha-salsa', '{baroa, batata-baroa, mandioquinha, batata-salsa, batata fiúza, cenoura-amarela}', 2),
       ('rabanete', '{}', 2),
       ('taro', '{}', 2),
       ('alface', '{}', 3),
       ('brócolis', '{brócolis, brócolos, couve-brócolos}', 3),
       ('almeirão', '{chicória amarga}', 3),
       ('bertalha', '{bretalha, couve-de-cerca, joão-gomes, espinafre-indiano, folha-tartaruga}', 3),
       ('cebolinha', '{}', 3),
       ('chicória', '{escarola, endívia}', 3),
       ('coentro', '{}', 3),
       ('couve', '{couve manteiga, couve de folhas}', 3),
       ('couve-chinesa', '{repolho chinês}', 3),
       ('mostarda', '{}', 3),
       ('rúcula', '{}', 3),
       ('salsa', '{salsinha}', 3),
       ('taioba', '{}', 3);

INSERT INTO seller_products (product_id, seller_id, price, unit, unit_quantity, quantity, photos, description)
VALUES (10, 2, 2.00, 3, 200, 250, '{9FjOp5ODh6I, EELIDA5Ox+M}',
        'Alfaces lisas orgânicas, frescas e crocantes, ideais para saladas.'),
       (22, 2, 1.75, 3, 200, 250, '{mc1NJjMTncM}',
        'Taiobas tenras, com sabor suave, ótimas para refogados e sopas.'),
       (1, 2, 1.50, 3, 100, 400, '{rCiQlCqVz8w, ZKg9fM2ZeNE}',
        'Pepinos frescos, crocantes e refrescantes, ideais para saladas.'),
       (2, 2, 2.50, 3, 200, 300, '{j4133R03xx8, jKYmFxcXe1k}',
        'Pimentas vermelhas, picantes e aromáticas, perfeitas para temperar pratos.'),

       (11, 3, 3.50, 3, 500, 180, '{GThy4djMxuI}',
        'Brócolis nutritivos, ricos em fibras e vitaminas, excelentes cozidos ou crus.'),
       (19, 3, 2.75, 3, 400, 180, '{HxZz3dY4tG4, Nk3JgwmZmNA}',
        'Mostardas picantes, ricas em antioxidantes, excelentes para temperar carnes.'),

       (12, 5, 1.75, 3, 100, 300, '{TMz5lk6aJIQ}',
        'Almeirões amargos, com folhas tenras, perfeitos para refogados e sopas.'),
       (8, 5, 1.50, 3, 300, 270, '{0g5XZmZGQho}',
        'Rabanetes vermelhos, com sabor suave, ideais para decorar pratos e cozinhar.'),

       (13, 9, 2.25, 3, 150, 400, '{yY21eA⁄Dskw}',
        'Bertalhas frescas, com sabor suave, ótimas para salteados e ensopados.'),
       (3, 9, 3.00, 3, 250, 350, '{Yjs6Z14vjco}',
        'Pimentões coloridos, suculentos e versáteis na culinária.'),

       (14, 12, 1.50, 3, 300, 500, '{0tITGzMxEkY}',
        'Cebolinhas verdes, com aroma intenso, ideais para decorar pratos e cozinhar.'),

       (18, 15, 3.25, 3, 500, 130, '{jAwGg4OWrh0, ⁄V1vPx2EhDI}',
        'Couve-chinesa fresca, com folhas crocantes, perfeita para salteados e ensopados.'),

       (16, 17, 2.50, 3, 100, 450, '{LoeJRtUUDEc}',
        'Coentros frescos, com aroma característico, essenciais para temperos e sucos.'),
       (4, 17, 1.75, 3, 150, 450, '{mvJyY0bWPC0}',
        'Quiabos tenros, com sabor delicado, ótimos para refogados e ensopados.'),

       (17, 18, 1.20, 3, 150, 600, '{OZyWwZTpKec}',
        'Couves manteiga, tenras e suculentas, ótimas para refogados e caldos.');

INSERT INTO products_schedules (seller_product_id, schedule_id)
VALUES (1, 1),
       (1, 2),
       (2, 1),
       (2, 2),
       (3, 1),
       (3, 2),
       (4, 1),
       (4, 2),

       (5, 3),
       (5, 4),
       (6, 3),
       (6, 4),
       (7, 3),
       (7, 4),

       (8, 5),
       (8, 6),
       (9, 5),
       (9, 6),

       (10, 7),
       (10, 8),
       (11, 7),
       (11, 8),

       (12, 9),
       (12, 10),

       (13, 11),
       (13, 12),

       (14, 13),
       (14, 14),
       (15, 13),
       (15, 14);

INSERT INTO products_seen_recently (seller_product_id, customer)
VALUES (1, 1),
       (3, 1),
       (5, 1),
       (2, 6),
       (4, 6),
       (6, 6),
       (7, 7),
       (9, 7),
       (11, 7),
       (8, 8),
       (10, 8),
       (12, 8),
       (13, 11),
       (15, 11),
       (14, 13),
       (1, 16),
       (7, 16),
       (13, 16),
       (2, 19),
       (8, 19),
       (14, 19),
       (3, 20),
       (9, 20),
       (15, 20);