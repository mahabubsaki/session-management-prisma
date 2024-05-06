import catchAsync from "../../../utils/catchAsync";
import services from "../services";

const allDivisonsController = catchAsync(async (_, res, __) => {
    const result = await services.getAllDivisons();
    res.status(200).json({
        status: 'success',
        message: 'Divisons Controller',
        data: result
    });
});

const postDivisonsController = catchAsync(async (req, res, _) => {
    const { unique_name, name, nameBn, latitude, longitude, population, area, density, literacyRate, website } = req.body;
    const result = await services.createDivision({
        unique_name,
        name,
        nameBn,
        latitude,
        longitude,
        population,
        area,
        density,
        literacyRate,
        website
    });
    res.status(201).json({
        status: 'success',
        message: 'Divisons Controller',
        data: result
    });

});


export default { allDivisonsController, postDivisonsController };