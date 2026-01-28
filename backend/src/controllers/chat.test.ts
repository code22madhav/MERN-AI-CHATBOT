import request from 'supertest';
import app from '../app';
import User from '../models/user';


//when ever we mock a module we have to mock complete exports from it there all though testing some route don't
// involve both the midddleware but it has to be mocked since the complete module is exported
jest.mock('../utils/token-manager', () => ({
  verifyToken: (_req: any, res: any, next: any) => {
    res.locals.jwtData = { id: 'test-user-id' };
    next();
  },
  optionalAuth: (_req: any, res: any, next: any) => {
    res.locals.jwtData = null;
    next();
  },
}));

jest.mock('../models/user');

describe('CHAT API',()=>{
    describe('Test get /all',()=>{
        test('It should respond with 200 success', async ()=>{
            (User.findById as jest.Mock).mockResolvedValue({
                chats: [],
            });
            const res=await request(app).get('/v1/chats/all').expect('Content-type',/json/).expect(200);
        });
    });
    describe('Test post /new',()=>{
        test('It should respond with 200 success', async()=>{
            const res=await request(app).post('/v1/chats/new').send({message:"hi how are you", chatHistory:[]}).expect(200).expect('Content-type',/json/);
        })
    })
    describe('Test get /delete',()=>{
        test('It should respond with 200 success', async()=>{
            const res=await request(app).get('/v1/chats/delete').expect('Content-type',/json/).expect(200);
            expect(res.body).toEqual({
                chats: [],
            });
        })
    })
})