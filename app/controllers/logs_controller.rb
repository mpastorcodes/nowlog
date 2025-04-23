class LogsController < ApplicationController
  def index
    @log = Log.new
    @logs = Log.order(created_at: :desc).limit(10)
  end

  def create
    if request.get?
      render :create
    else
      @log = Log.new(log_params)
      
      if @log.save
        redirect_to root_path, notice: "Log was successfully created."
      else
        @logs = Log.order(created_at: :desc).limit(10)
        render :index, status: :unprocessable_entity
      end
    end
  end

  private

  def log_params
    params.require(:log).permit(:content)
  end
end
