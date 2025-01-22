import { Types } from 'mongoose';
import customPaginator from '../../infra/utils/customPaginator';
import { BureauRepository } from '../types/repository';
import { Logger } from '../types/logger';
import { Config } from '../types/config';
import UserModel, { User } from '../../models/User'; // Adjust this import according to your project structure
import { Request } from '../types/request';

interface Bureau {
    ID: Types.ObjectId;
    PrimaryContact: string;
    EmployerCount: number;
    UsersID: Types.ObjectId;
    PrimaryContactPhoneNumber: string;
    PayrollSoftware: string;
    PrimaryContactMobile: string;
    Address: string;
    City: string;
    State: string;
    Country: string;
    Zip: string;
    Status: string;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}
/**
 * Retrieves all bureaus based on the provided query parameters.
 * 
 * @param req - The request object containing query parameters.
 * @returns An object containing the retrieved bureaus, a success message, and pagination metadata.
 * @throws An error if there is an issue retrieving the bureaus.
 */
export default ({ bureauRepository, config, logger }: {
    bureauRepository: BureauRepository,
    config: Config,
    logger: Logger
}) => {
    const all = async (req: Request) => {
        try {
            const Status = req.query.Status || null;
            const pageSize = parseInt(req.query.PageSize!) || config.pageSize;
            const pageNumber = parseInt(req.query.PageNumber!) || 0;
            const sortBy = req.query.SortBy || null;
            const orderBy = req.query.OrderBy || null;
            const search = req.query.Search || null;

            let queryParameters: any = {
                limit: pageSize,
                skip: pageNumber * pageSize,
                where: { IsActive: true },
                populate: {
                    path: 'UsersID',
                    select: 'ID Email LegalName IsActive createdAt updatedAt',
                },
                select: 'ID PrimaryContact EmployerCount UsersID PrimaryContactPhoneNumber PayrollSoftware PrimaryContactMobile Address City State Country Zip Status IsActive CreatedAt UpdatedAt',
                sort: { CreatedAt: -1 }
            };

            if (sortBy && orderBy) {
                queryParameters.sort = { [sortBy]: orderBy === 'asc' ? 1 : -1 };
            }

            let isSearchable = false;

            if (search) {
                const searchClaus = new RegExp(search, 'i');

                if (/\b(?:Active|Pending|Blocked)\b/i.test(search)) {
                    queryParameters.where = { ...queryParameters.where, Status: searchClaus };
                } else {
                    queryParameters.populate.match = {
                        $or: [
                            { LegalName: searchClaus },
                            { CreatedAt: searchClaus }
                        ]
                    };
                }
                isSearchable = true;
            }

            if (Status) {
                queryParameters.where.Status = Status;
            }

            let data: Bureau[] = await bureauRepository.getAll(queryParameters);
            
            const promises = data.map(async (element: Bureau) => {
                element.EmployerCount = await UserModel.countDocuments({ BureausID: element.ID, IsActive: true });
                return element;
            });

            await Promise.all(promises);

            const countQueryParams: any = { where: { IsActive: true } };
            if (search) {
                const searchClaus = new RegExp(search, 'i');
                if (/\b(?:Active|Pending|Blocked)\b/i.test(search)) {
                    countQueryParams.where.Status = searchClaus;
                } else {
                    countQueryParams.where.$or = [
                        { LegalName: searchClaus },
                        { CreatedAt: searchClaus }
                    ];
                }
            }

            const totalCount = await bureauRepository.countAll(countQueryParams);

            const paginateMeta = await customPaginator.paginator(req, totalCount, pageSize, data.length, pageNumber, isSearchable);

            return {
                data,
                message: config.messages.success.listBureau,
                paginateMeta,
            };
        } catch (err) {
            logger.error(err.message);
            const error = config.messages.error.listBureau;
            throw { data: {}, error };
        }
    };

    const getById = async ({ ID }: { ID: string }) => {
        try {
            let bureau: any = await bureauRepository.findById(ID)
                .populate({
                    path: 'UsersID',
                    select: 'ID Email LegalName IsActive',
                })
                .select('ID UsersID EmployerCount PrimaryContact PrimaryContactPhoneNumber PayrollSoftware PrimaryContactMobile Address City State Country Zip Status IsActive CreatedAt UpdatedAt');

            let data: any = { ...bureau };

            try {
                const sourceFile: any = await sourceFileRepository.findOne({
                    where: {
                        BureausID: bureau.ID
                    },
                    attributes: [
                        'ID', 'FileName', 'IsActive', 'CreatedAt', 'UpdatedAt'
                    ]
                });
                data = { ...data, SampleFile: sourceFile };
            } catch (err) {
                // Handle the error if necessary
            }

            const message = "Successfully got bureau details";
            return { data, message };
        } catch (err) {
            logger.error(err.message);
            const data: any = {};
            const error = "An error occurred while getting bureau details";
            throw { data, error };
        }
    };

    return { all, getById };
};
