class Log < ApplicationRecord
  validates :content, presence: true
end
