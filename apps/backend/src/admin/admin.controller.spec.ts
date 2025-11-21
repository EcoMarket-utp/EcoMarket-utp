import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
            getUsersByRole: jest.fn(),
            updateUserRole: jest.fn(),
            updateUserStatus: jest.fn(),
            createAdminUser: jest.fn(),
            deleteUser: jest.fn(),
            getUserStatistics: jest.fn(),
            searchUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const result = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, pages: 0 },
      };
      jest.spyOn(service, 'getAllUsers').mockResolvedValue(result);

      expect(await controller.getAllUsers()).toEqual(result);
    });
  });
});
