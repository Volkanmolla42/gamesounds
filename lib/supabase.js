import { createClient } from '@supabase/supabase-js'

// Supabase URL ve ANON_KEY için çevre değişkenlerini kullanın
// Bu değerleri Supabase projesi oluşturduğunuzda alacaksınız
// .env.local dosyasından okunan değerlerle değiştirilmelidir
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase istemcisini oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
