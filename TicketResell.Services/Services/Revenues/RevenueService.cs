using AutoMapper;
using Repositories.Constants;
using Repositories.Core.Dtos.Revenue;
using Repositories.Core.Entities;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.Revenues;

public class RevenueService : IRevenueService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RevenueService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResponseModel> CreateRevenueAsync(RevenueCreateDto dto)
    {
        Revenue newRevenue = _mapper.Map<Revenue>(dto);
        newRevenue.StartDate = DateTime.UtcNow;
        newRevenue.EndDate = newRevenue.StartDate.Value.AddMonths(1);
        newRevenue.Type = RevenueConstant.MONTH_TYPE;
        await _unitOfWork.RevenueRepository.CreateAsync(newRevenue);
        await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Successfully created Revenue");
    }

    public async Task<ResponseModel> GetRevenuesAsync()
    {
        var revenues = await _unitOfWork.RevenueRepository.GetAllAsync();
        var revenueDtos = _mapper.Map<IEnumerable<RevenueReadDto>>(revenues);
        return ResponseModel.Success($"Successfully get revenues", revenueDtos);
    }

    public async Task<ResponseModel> GetRevenuesByIdAsync(string id)
    {
        var revenues = await _unitOfWork.RevenueRepository.GetByIdAsync(id);
        var revenueDtos = _mapper.Map<RevenueReadDto>(revenues);
        return ResponseModel.Success($"Successfully get revenues with id", revenueDtos);
    }

    public async Task<ResponseModel> GetRevenuesBySellerIdAsync(string id)
    {
        var revenues = await _unitOfWork.RevenueRepository.GetRevenuesBySellerIdAsync(id);
        
        var revenueDtos = _mapper.Map<IEnumerable<RevenueReadDto>>(revenues);
        return ResponseModel.Success($"Successfully get revenues with sellerId ", revenueDtos);
    }

    public async Task<ResponseModel> UpdateRevenueAsync(string id, RevenueUpdateDto dto)
    {
        string type = RevenueConstant.MONTH_TYPE;
        var revenues = await  _unitOfWork.RevenueRepository.GetRevenuesBySellerId_MonthAsync(id, type);

        DateTime date = DateTime.Now;
        foreach (var revenue in revenues)
        {
            if (revenue.StartDate <= date && date <= revenue.EndDate)
            {
                _mapper.Map(dto, revenue);
                _unitOfWork.RevenueRepository.Update(revenue);
                await _unitOfWork.CompleteAsync();
            }
            
        }

        return ResponseModel.Success($"Successfully update revenue with id: {id}");
    }

    public async Task<ResponseModel> DeleteRevenuesAsync(string id)
    {
        await _unitOfWork.RevenueRepository.DeleteByIdAsync(id);
        await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted Revenue(s) with id: {id}");
    }

    public async Task<ResponseModel> DeleteRevenuesBySellerIdAsync(string id)
    {
        var revenues = await _unitOfWork.RevenueRepository.GetRevenuesBySellerIdAsync(id);
        
        foreach (var revenueItem in revenues)
        {
             _unitOfWork.RevenueRepository.Delete(revenueItem);
             await _unitOfWork.CompleteAsync();
        }
        
        return ResponseModel.Success($"Successfully deleted Revenue(s) with SellerID: {id}");
    }


}