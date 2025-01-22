import { Container } from 'dependency-injection';
import { UserRepository, BureauRepository } from './repositories'; // Assuming these are your repository interfaces
import { JWT } from './jwt'; // Assuming this is your JWT module/interface
import { Config } from './config'; // Assuming this is your configuration module/interface

interface Credentials {
    Email: string;
    LegalName: string;
    Password: string;
    Type: string;
    IsActive: number;
}

interface BureauDetails {
    PrimaryContact: string;
    PrimaryContactPhoneNumber: string;
    PrimaryContactMobile: string;
    Address: string;
    City: string;
    State: string;
    Country: string;
    Zip: string;
    UsersID: string;
}

interface TestManager {
    testUser: (credentials?: Credentials | null, isBureau?: boolean) => Promise<any>;
    authToken: (user: { ID: string; Email: string; Type: string }, useCase?: string | null) => Promise<any>;
    testBureau: () => Promise<any>;
}

const testManager = (container: Container, config: Config): TestManager => {
    const userRepository = container.resolve<UserRepository>('userRepository');
    const bureauRepository = container.resolve<BureauRepository>('bureauRepository');
    const jwt = container.resolve<JWT>('jwt');

    const signIn = jwt.signin();

    const testUser = async (credentials: Credentials | null = null, isBureau = false): Promise<any> => {
        if (!credentials) {
            credentials = {
                Email: 'testdev1@gmail.com',
                LegalName: 'test_legal_name',
                Password: 'test@123',
                Type: isBureau ? 'Bureau' : 'ADMIN',
                IsActive: 1,
            };
        }

        return await userRepository.create(credentials);
    };

    const authToken = async (user: { ID: string; Email: string; Type: string }, useCase: string | null = null): Promise<any> => {
        return signIn({
            ID: user.ID,
            Email: user.Email,
            Type: user.Type,
            useCase: !useCase ? config.passwordChangeUseCase : useCase,
        });
    };

    const testBureau = async (): Promise<any> => {
        const bureauDetails: BureauDetails = {
            PrimaryContact: '9912839744',
            PrimaryContactPhoneNumber: '1478546324',
            PrimaryContactMobile: '1478546324',
            Address: 'test address',
            City: 'xyz',
            State: 'test-state',
            Country: 'test-city',
            Zip: '25457',
            UsersID: '', // Will be updated after user creation
        };

        const userData: Credentials = {
            Email: `test_bureau${Math.random()}@yopmail.com`,
            LegalName: 'test-legal-name',
            Password: 'test@123',
            Type: 'Bureau',
            IsActive: 1,
        };

        const user = await testUser(userData);
        bureauDetails.UsersID = user.ID;

        return await bureauRepository.create(bureauDetails);
    };

    return {
        testUser,
        authToken,
        testBureau,
    };
};

export default testManager;
