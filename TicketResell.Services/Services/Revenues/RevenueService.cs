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

    public async Task<ResponseModel> CreateRevenueAsync(RevenueCreateDto dto,bool saveAll)
    {
        Revenue? newRevenue = _mapper.Map<Revenue>(dto);
        newRevenue.StartDate = DateTime.UtcNow;
        newRevenue.EndDate = newRevenue.StartDate.Value.AddMonths(1);
        newRevenue.Type = RevenueConstant.MONTH_TYPE;
        await _unitOfWork.RevenueRepository.CreateAsync(newRevenue);
        if(saveAll) await _unitOfWork.CompleteAsync();
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

    public async Task<ResponseModel> UpdateRevenueAsync(string id, RevenueUpdateDto dto,bool saveAll)
    {
        string type = RevenueConstant.MONTH_TYPE;
        var revenues = await  _unitOfWork.RevenueRepository.GetRevenuesBySellerId_MonthAsync(id, type);

        DateTime date = DateTime.UtcNow;
        foreach (var revenue in revenues)
        {
            if (revenue.StartDate <= date && date <= revenue.EndDate)
            {
                _mapper.Map(dto, revenue);
                _unitOfWork.RevenueRepository.Update(revenue);
                if(saveAll)  await _unitOfWork.CompleteAsync();
            }
            
        }

        return ResponseModel.Success($"Successfully update revenue with id: {id}");
    }

    public async Task<ResponseModel> DeleteRevenuesAsync(string id,bool saveAll)
    {
        await _unitOfWork.RevenueRepository.DeleteByIdAsync(id);
        if(saveAll)  await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted Revenue(s) with id: {id}");
    }

    public async Task<ResponseModel> DeleteRevenuesBySellerIdAsync(string id,bool saveAll)
    {
        var revenues = await _unitOfWork.RevenueRepository.GetRevenuesBySellerIdAsync(id);
        
        foreach (var revenueItem in revenues)
        {
             _unitOfWork.RevenueRepository.Delete(revenueItem);
             if(saveAll) await _unitOfWork.CompleteAsync();
        }
        
        return ResponseModel.Success($"Successfully deleted Revenue(s) with SellerID: {id}");
    }

    public async Task<ResponseModel> AddRevenueByDateAsync(DateTime date, double amount, bool saveAll)
    {
        // Using the updated repository method to add revenue by date
        await _unitOfWork.RevenueRepository.AddRevenueByDateAsync(date, amount);

        if (saveAll)
        {
            await _unitOfWork.CompleteAsync();
        }

        return ResponseModel.Success("Successfully added revenue for the specified date");
    }

}