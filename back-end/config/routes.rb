Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
  # Defines the root path route ("/")
  # root "articles#index"

  get "/textme", to: "auth#textme" 
  get "/verify", to: "auth#verify" 
  get "/profile", to: "auth#profile" 
  post "/login", to: "auth#login" 
  post "/signup", to: "auth#signup" 
  get "/chat", to: "messages#index"
  post "/send-message", to: "messages#create"
  post "/create-room", to: "rooms#create"
  get "/order-history", to: "orders#index" 
  post "/complete-order", to: "orders#create" 
  get "/products", to: "products#index"
  get "/products/:uuid", to: "products#show"
  get "/users", to: "users#index"
  post "/user-detail", to: "users#show"
  
  #  This  Route uses form data to create a new product
  post "/create-product", to: "products#create"
  
end
