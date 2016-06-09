class RatingsController < ApplicationController
  before_action :set_rating, only: [:show, :edit, :update, :destroy]
  before_action :set_client, only: [:new, :create]

  # GET /ratings
  # GET /ratings.json
  def index
    @ratings = Rating.all
  end

  # GET /ratings/1
  # GET /ratings/1.json
  def show
  end

  # GET /ratings/new
  def new
    @rating = Rating.new
    @place_id = params[:place_id]
    @client = GooglePlaces::Client.new(G_PLACE_KEY)
    if params[:place_id] != nil
      begin
        @spot = @client.spot(params[:place_id])
      rescue => ex
        $establishment = nil
        redirect_to root_path, :flash => {:error => "Erro, por favor, pesquise de novo."}
      end
    else
      redirect_to root_path, :flash => {:error => "Erro, por favor, pesquise de novo."}
    end
  end

  # GET /ratings/1/edit
  def edit
  end

  # POST /ratings
  # POST /ratings.json
  def create
    if(params[:accepted_terms])
      @rating = Rating.new(rating_params)
      @establishment = Establishment.search_by_id(params[:place_id]).first
      if(@establishment.nil?)
        @place = @client.spot(params[:place_id])
        @establishment = Establishment.create!(name: @place.name, address: @place.formatted_address, lat: @place.lat, lng: @place.lng, id_places: @place.place_id)
      end

      @rating.establishment_id = @establishment.id

      respond_to do |format|
        if @rating.save
          format.html { redirect_to @establishment, notice: 'Avaliação feita com sucesso' }
        else
          format.html { render :new }
        end
      end
    else
      respond_to do |format|
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /ratings/1
  # PATCH/PUT /ratings/1.json
  def update
    respond_to do |format|
      if @rating.update(rating_params)
        format.html { redirect_to @rating, notice: 'Rating was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /ratings/1
  # DELETE /ratings/1.json
  def destroy
    @rating.destroy
    respond_to do |format|
      format.html { redirect_to ratings_url, notice: 'Rating was successfully destroyed.' }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rating
      @rating = Rating.find(params[:id])
    end

    def set_client
      @client = GooglePlaces::Client.new(G_PLACE_KEY)
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def rating_params
      params.require(:rating).permit(:woman, :lgbtqia, :race, :disability, :elder, :obese, :name, :cpf, :email, :phone, :rating_date, :establishment_id)
    end


end
