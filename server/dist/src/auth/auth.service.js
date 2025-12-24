"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        let isProfileComplete = true;
        let patient = null;
        if (user.role === 'PATIENT') {
            patient = await this.prisma.patient.findFirst({ where: { userId: user.id } });
            if (!patient || !patient.weight) {
                isProfileComplete = false;
            }
        }
        let doctorId = null;
        if (user.role === 'DOCTOR') {
            const doctor = await this.prisma.doctor.findFirst({
                where: { email: user.email }
            });
            if (doctor) {
                doctorId = doctor.id;
                payload['doctorId'] = doctorId;
            }
        }
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '8h' }),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            patient: patient,
            doctorId: doctorId,
            isProfileComplete,
        };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const newAccessToken = this.jwtService.sign(Object.assign({ sub: payload.sub, email: payload.email, role: payload.role }, (payload.doctorId && { doctorId: payload.doctorId })), { expiresIn: '8h' });
            return {
                access_token: newAccessToken,
                refresh_token: refreshToken,
            };
        }
        catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
    async register(data) {
        const BCRYPT_ROUNDS = 12;
        const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
        const { createHash } = await Promise.resolve().then(() => require('crypto'));
        const blockchainId = createHash('sha256').update(data.email + Date.now().toString()).digest('hex');
        let newUser;
        try {
            newUser = await this.usersService.createUser({
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role,
                blockchainId: blockchainId,
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Email or Blockchain ID already exists');
            }
            throw error;
        }
        if (data.role === 'PATIENT') {
            await this.prisma.patient.create({
                data: {
                    userId: newUser.id,
                    mrn: `MRN-${Date.now().toString().substring(6)}`,
                    dob: new Date('1990-01-01'),
                    gender: 'Unknown',
                    weight: data.weight || '70 kg',
                    status: data.status || 'Admitted',
                    symptoms: data.symptoms || 'None recorded',
                    bed: 'Unassigned',
                    ward: 'General',
                },
            });
        }
        else if (data.role === 'DOCTOR') {
            try {
                await this.prisma.doctor.upsert({
                    where: { email: data.email },
                    update: {
                        userId: newUser.id,
                        name: data.name,
                    },
                    create: {
                        userId: newUser.id,
                        name: data.name,
                        email: data.email,
                        specialty: data.specialty || 'General Practice',
                    },
                });
            }
            catch (e) {
                console.warn('Doctor profile creation warning:', e);
            }
        }
        else if (data.role === 'NURSE') {
        }
        return newUser;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { password } = user, result = __rest(user, ["password"]);
        let profile = Object.assign({}, result);
        if (user.role === 'PATIENT') {
            const patient = await this.prisma.patient.findFirst({
                where: { userId: user.id },
            });
            profile.patient = patient;
            profile.patientId = patient === null || patient === void 0 ? void 0 : patient.id;
        }
        else if (user.role === 'DOCTOR') {
            let doctor = await this.prisma.doctor.findFirst({
                where: { userId: user.id },
            });
            if (!doctor) {
                doctor = await this.prisma.doctor.findFirst({
                    where: { email: user.email },
                });
            }
            profile.doctor = doctor;
            profile.doctorId = doctor === null || doctor === void 0 ? void 0 : doctor.id;
        }
        return profile;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map