# 📧 Настройка Email для ARISE (Supabase)

## Проблема
Supabase по умолчанию использует свой тестовый SMTP, который:
- Медленный (письма идут до 10 минут)
- Ненадёжный (письма могут не приходить)
- Попадает в спам

## ✅ Решение: Настроить свой SMTP

---

## Вариант 1: Gmail (БЕСПЛАТНО, 5 минут)

### Шаг 1: Создай App Password в Gmail

1. Открой: https://myaccount.google.com/security

2. Включи **"2-Step Verification"** (если не включена)

3. После включения 2FA, открой:
   https://myaccount.google.com/apppasswords

4. Создай новый App Password:
   - **App name**: "ARISE Supabase"
   - Нажми **"Generate"**

5. **Скопируй 16-значный пароль** (например: `abcd efgh ijkl mnop`)

---

### Шаг 2: Настрой SMTP в Supabase

1. Открой Supabase Dashboard:
   ```
   https://app.supabase.com/project/_/settings/auth
   ```

2. Прокрути до **"SMTP Settings"**

3. Выбери **"Enable Custom SMTP"**

4. Заполни данные:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Password: abcd efgh ijkl mnop  (App Password из шага 1)
   Sender Email: your-email@gmail.com
   Sender Name: ARISE System
   ```

5. Нажми **"Save"**

---

### Шаг 3: Проверь

1. Открой приложение ARISE
2. Нажми "Forgot Password?"
3. Введи свой email
4. Письмо должно прийти в течение **5-10 секунд**

---

## Вариант 2: SendGrid (БЕСПЛАТНО до 100 писем/день)

### Шаг 1: Создай аккаунт SendGrid

1. Зарегистрируйся: https://signup.sendgrid.com/

2. Подтверди email

3. Создай API Key:
   - Settings → API Keys → Create API Key
   - Name: "ARISE"
   - Permissions: "Full Access"
   - Нажми **"Create & View"**
   - **Скопируй API Key** (будет показан только 1 раз!)

---

### Шаг 2: Настрой SMTP в Supabase

1. Открой Supabase Dashboard:
   ```
   https://app.supabase.com/project/_/settings/auth
   ```

2. Прокрути до **"SMTP Settings"**

3. Выбери **"Enable Custom SMTP"**

4. Заполни данные:
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey  (буквально слово "apikey")
   SMTP Password: <твой API Key из шага 1>
   Sender Email: noreply@yourdomain.com
   Sender Name: ARISE System
   ```

5. Нажми **"Save"**

---

### Шаг 3: Верифицируй Sender

1. В SendGrid открой: Settings → Sender Authentication

2. Выбери **"Single Sender Verification"**

3. Заполни форму:
   - From Email Address: noreply@yourdomain.com (или твой Gmail)
   - Reply To: твой настоящий email

4. Подтверди email

---

## Вариант 3: Mailgun (БЕСПЛАТНО до 5000 писем/месяц)

1. Зарегистрируйся: https://www.mailgun.com/

2. Получи SMTP credentials:
   - Sending → Domain Settings → SMTP credentials

3. Настрой в Supabase:
   ```
   SMTP Host: smtp.mailgun.org
   SMTP Port: 587
   SMTP User: postmaster@yourdomain.mailgun.org
   SMTP Password: <твой Mailgun password>
   ```

---

## 🔍 Проверка настроек

После настройки SMTP, проверь:

1. **Test Email** (в Supabase Dashboard):
   - SMTP Settings → "Send Test Email"
   - Должно прийти мгновенно

2. **Password Reset**:
   - Открой ARISE → Forgot Password
   - Письмо должно прийти в течение 5-10 секунд

3. **Проверь спам-папку** (первое письмо может туда попасть)

---

## 🚨 Важные замечания

1. **Не используй личный Gmail для production** - Google может заблокировать аккаунт за массовую рассылку

2. **Для production используй:**
   - SendGrid (до 100 писем/день бесплатно)
   - Mailgun (до 5000 писем/месяц)
   - Amazon SES (очень дёшево)

3. **Храни SMTP пароли в безопасности** - это чувствительные данные

---

## 📌 Что если всё равно не работает?

1. Проверь консоль браузера на ошибки
2. Проверь Redirect URLs в Supabase
3. Проверь Email Templates в Supabase
4. Открой Supabase → Logs → Auth Logs - там будут ошибки отправки

---

## ✅ После настройки

- Письма приходят **мгновенно** (5-10 секунд)
- Не попадают в спам
- Надёжная доставка
- Можно отследить статус в dashboard провайдера
