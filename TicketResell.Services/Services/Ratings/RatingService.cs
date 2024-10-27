using AutoMapper;
using Repositories.Core.Entities;
using TicketResell.Repositories.Core.Dtos.Rating;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.Ratings;

public class RatingService : IRatingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RatingService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResponseModel> CreateRatingAsync(RatingCreateDto dto, bool saveAll= true)
    {
        var newRating = _mapper.Map<Rating>(dto);
        newRating.CreateDate = DateTime.UtcNow;
        await _unitOfWork.RatingRepository.CreateAsync(newRating);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully created Rating");
    }

    public async Task<ResponseModel> GetRatingsAsync()
    {
        var ratings = await _unitOfWork.RatingRepository.GetAllAsync();
        var ratingDtos = _mapper.Map<IEnumerable<RatingReadDto>>(ratings);
        return ResponseModel.Success("Successfully retrieved ratings", ratingDtos);
    }

    public async Task<ResponseModel> GetRatingByIdAsync(string id)
    {
        var rating = await _unitOfWork.RatingRepository.GetByIdAsync(id);
        var ratingDto = _mapper.Map<RatingReadDto>(rating);
        return ResponseModel.Success("Successfully retrieved rating by ID", ratingDto);
    }

    public async Task<ResponseModel> GetRatingsBySellerIdAsync(string sellerId)
    {
        var ratings = await _unitOfWork.RatingRepository.GetRatingsBySellerIdAsync(sellerId);
        var ratingDtos = _mapper.Map<IEnumerable<RatingReadDto>>(ratings);
        return ResponseModel.Success("Successfully retrieved ratings for seller", ratingDtos);
    }

    public async Task<ResponseModel> GetRatingsByUserIdAsync(string userId)
    {
        var ratings = await _unitOfWork.RatingRepository.GetRatingsByUserIdAsync(userId);
        var ratingDtos = _mapper.Map<IEnumerable<RatingReadDto>>(ratings);
        return ResponseModel.Success("Successfully retrieved ratings for seller", ratingDtos);
    }

    public async Task<ResponseModel> UpdateRatingAsync(string id, RatingUpdateDto dto, bool saveAll=true)
    {
        var rating = await _unitOfWork.RatingRepository.GetByIdAsync(id);
        _mapper.Map(dto, rating);
        _unitOfWork.RatingRepository.Update(rating);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully updated rating with ID: {id}");
    }

    public async Task<ResponseModel> DeleteRatingAsync(string id, bool saveAll= true)
    {
        await _unitOfWork.RatingRepository.DeleteByIdAsync(id);
        if (saveAll) await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted rating with ID: {id}");
    }

    // public async Task<ResponseModel> DeleteRatingsBySellerIdAsync(string sellerId, bool saveAll)
    // {
    //     var ratings = await _unitOfWork.RatingRepository.GetRatingsBySellerIdAsync(sellerId);
    //     foreach (var rating in ratings)
    //     {
    //         _unitOfWork.RatingRepository.Delete(rating);
    //     }
    //     if (saveAll) await _unitOfWork.CompleteAsync();
    //     return ResponseModel.Success($"Successfully deleted ratings for seller with ID: {sellerId}");
    // }

    

}