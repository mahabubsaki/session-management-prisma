import { CustomResponse } from "../../../interface";
import { AppResponse } from "../../../types";
import catchAsync from "../../../utils/catchAsync";
import services from "../services";

const allDivisonsController = catchAsync(async (_, res, __) => {
    const result = await services.getAllDivisons();
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Divisons Controller',
        data: result
    });
});

const postDivisonsController = catchAsync(async (req, res: CustomResponse<AppResponse>, _) => {
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
        success: true,
        message: 'Divisons Controller',
        data: result,
        statusCode: 201
    });

});


export default { allDivisonsController, postDivisonsController };