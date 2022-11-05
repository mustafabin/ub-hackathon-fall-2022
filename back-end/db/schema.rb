# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_11_05_195547) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "super_tokens", force: :cascade do |t|
    t.string "token"
    t.datetime "expiry"
    t.integer "user_id"
    t.string "agent"
    t.string "client_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "display_name"
    t.string "email"
    t.string "phone"
    t.string "password_digest"
    t.string "lat"
    t.string "long"
    t.boolean "sms_verified", default: false
    t.boolean "email_verified", default: false
    t.boolean "is_uncle"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
