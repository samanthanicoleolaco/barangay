-- Initial Seed Data for B-Healthcare

-- Insert Medicines
insert into medicines (name, category, unit, quantity, reorder_level, expiry_date)
values 
  ('Paracetamol 500mg', 'Analgesic', 'Tablets', 500, 200, '2027-06-15'),
  ('Amoxicillin 500mg', 'Antibiotic', 'Capsules', 250, 100, '2026-12-20'),
  ('Mefenamic Acid 500mg', 'Analgesic', 'Tablets', 180, 100, '2027-02-28'),
  ('Cotrimoxazole 800mg/160mg', 'Antibiotic', 'Tablets', 120, 80, '2026-11-30'),
  ('Cetirizine 10mg', 'Antihistamine', 'Tablets', 95, 50, '2026-11-18'),
  ('Oral Rehydration Salts', 'Electrolyte', 'Sachets', 300, 150, '2027-08-20'),
  ('Salbutamol 2mg', 'Bronchodilator', 'Tablets', 45, 50, '2026-10-15'),
  ('Metformin 500mg', 'Antidiabetic', 'Tablets', 8, 60, '2026-08-05'),
  ('Losartan 50mg', 'Antihypertensive', 'Tablets', 18, 60, '2026-09-10'),
  ('Amlodipine 5mg', 'Antihypertensive', 'Tablets', 0, 60, '2027-01-30'),
  ('Aluminum Hydroxide Gel', 'Antacid', 'Bottles', 35, 30, '2027-03-10'),
  ('Loperamide 2mg', 'Antidiarrheal', 'Capsules', 85, 50, '2026-12-28'),
  ('Ascorbic Acid 500mg', 'Vitamin', 'Tablets', 22, 100, '2027-05-12'),
  ('Ferrous Sulfate 325mg', 'Iron Supplement', 'Tablets', 150, 80, '2027-04-20'),
  ('Folic Acid 5mg', 'Vitamin', 'Tablets', 140, 80, '2027-07-15'),
  ('Multivitamins (Sangobion)', 'Vitamin', 'Capsules', 110, 60, '2026-10-25'),
  ('Metronidazole 500mg', 'Antibiotic', 'Tablets', 75, 60, '2026-09-18'),
  ('Ibuprofen 400mg', 'Analgesic', 'Tablets', 95, 80, '2027-03-25');

-- Insert Health Programs
insert into health_programs (name, date, status, participants)
values 
  ('Senior Citizen Monthly Check-up', '2026-04-12', 'ongoing', 45),
  ('Vaccination Day', '2026-04-15', 'upcoming', 80),
  ('Deworming Program', '2026-04-18', 'upcoming', 120),
  ('Maternal Care Program', '2026-04-08', 'completed', 25);

-- Link Program Medicines (Example based on hardcoded data)
-- Note: Simplified mapping using names for lookup
do $$
declare
    senior_id uuid;
    vaccine_id uuid;
    losartan_id uuid;
    metformin_id uuid;
    paracetamol_id uuid;
begin
    select id into senior_id from health_programs where name = 'Senior Citizen Monthly Check-up';
    select id into vaccine_id from health_programs where name = 'Vaccination Day';
    
    select id into losartan_id from medicines where name = 'Losartan 50mg';
    select id into metformin_id from medicines where name = 'Metformin 500mg';
    select id into paracetamol_id from medicines where name = 'Paracetamol 500mg';

    insert into program_medicines (program_id, medicine_id, quantity_needed)
    values 
      (senior_id, losartan_id, 45),
      (senior_id, metformin_id, 30),
      (vaccine_id, paracetamol_id, 100);
end $$;

-- Insert Recent Transactions
insert into stock_transactions (medicine_id, type, quantity, created_at)
select id, 'Stock In', 200, now() - interval '8 days' from medicines where name = 'Paracetamol 500mg' limit 1;

insert into stock_transactions (medicine_id, type, quantity, created_at)
select id, 'Used for Program', -80, now() - interval '8 days' from medicines where name = 'Oral Rehydration Salts' limit 1;

insert into stock_transactions (medicine_id, type, quantity, created_at)
select id, 'Stock In', 150, now() - interval '9 days' from medicines where name = 'Ferrous Sulfate 325mg' limit 1;

insert into stock_transactions (medicine_id, type, quantity, created_at)
select id, 'Dispensed', -25, now() - interval '9 days' from medicines where name = 'Mefenamic Acid 500mg' limit 1;
