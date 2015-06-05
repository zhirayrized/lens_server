class Api::V1::Applications::RequestsController < Api::ApplicationController
  def index
    @requests = application.requests(params)
    @data = @requests.map do |req|
      {
        id: req["id"],
        url: req["url"],
        datetime: req['datetime'],
        duration: req['duration']
      }
    end
    render json: @data
  end

  def show
    @request = application.requests(params)
    @data = {
      id: @request["id"],
      url: @reques["url"],
      datetime: @reques['datetime'],
      duration: @reques['duration']
    }
    render json: @data
  end

  private

  def application
    @application ||= current_user.participate_applications.find(params[:application_id])
  end
end
