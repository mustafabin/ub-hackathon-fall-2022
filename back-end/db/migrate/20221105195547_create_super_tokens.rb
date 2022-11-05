class CreateSuperTokens < ActiveRecord::Migration[7.0]
  def change
    create_table :super_tokens do |t|
      t.string :token, uniqueness: true
      t.datetime :expiry
      t.integer :user_id
      t.string :agent
      t.string :client_ip

      t.timestamps
    end
  end
end
