require 'json'
require 'normalizer'

module Parsers
  class Base
    def initialize(raw_data)
      @raw_data = ::JSON.parse(raw_data).with_indifferent_access
      @result = {}
    end

    def parse
      wrapped_data = @raw_data[:data]
      @result[:meta] =
        {
        start: wrapped_data[:start],
        finish: wrapped_data[:end],
        duration: wrapped_data[:duration]
      }

      @result[:details] = parse_records(wrapped_data[:records])

      @result
    end

    def parse_records(data)
      data.map do |record|
        ::Normalizer.new(record).normalize
      end.compact
    end
  end
end
