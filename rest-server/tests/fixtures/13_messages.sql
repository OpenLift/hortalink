INSERT INTO messages (author_id, content, created_at, chat, viewed)
VALUES
    (2, 'Olá, como você está?', NOW() - INTERVAL '10 minutes', 1, TRUE),
    (1, 'Estou bem, e você?', NOW() - INTERVAL '9 minutes', 1, FALSE),

    (2, 'Oi, tudo certo?', NOW() - INTERVAL '20 minutes', 2, TRUE),
    (6, 'Sim, e aí?', NOW() - INTERVAL '19 minutes', 2, FALSE),

    (2, 'E aí, novidades?', NOW() - INTERVAL '30 minutes', 3, TRUE),
    (7, 'Nada de novo por aqui.', NOW() - INTERVAL '29 minutes', 3, FALSE),

    (2, 'Como foi o dia?', NOW() - INTERVAL '40 minutes', 4, TRUE),
    (8, 'Trabalhei bastante.', NOW() - INTERVAL '39 minutes', 4, FALSE),

    (2, 'Oi!', NOW() - INTERVAL '50 minutes', 5, TRUE),
    (11, 'Oi, tudo bem?', NOW() - INTERVAL '49 minutes', 5, FALSE),

    (2, 'Alguma novidade?', NOW() - INTERVAL '1 hour', 6, TRUE),
    (13, 'Nada demais.', NOW() - INTERVAL '59 minutes', 6, FALSE),

    (2, 'Oi, tudo certo?', NOW() - INTERVAL '1 hour 10 minutes', 7, TRUE),
    (16, 'Tudo sim, e você?', NOW() - INTERVAL '1 hour 9 minutes', 7, FALSE),

    (2, 'Bora marcar algo?', NOW() - INTERVAL '1 hour 20 minutes', 8, TRUE),
    (19, 'Bora sim!', NOW() - INTERVAL '1 hour 19 minutes', 8, FALSE),

    (2, 'Bom dia!', NOW() - INTERVAL '1 hour 30 minutes', 9, TRUE),
    (20, 'Bom dia! Como vai?', NOW() - INTERVAL '1 hour 29 minutes', 9, FALSE);