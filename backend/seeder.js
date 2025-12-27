const { User, Department, MaintenanceTeam, Equipment, MaintenanceRequest, TeamMember } = require('./models');
const sequelize = require('./config/database');
require('dotenv').config();

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB for clean seed
        console.log('🔄 Database reset and synchronized');

        // 1. Create Departments
        const dept1 = await Department.create({
            name: 'Production Line A',
            description: 'Main production floor for heavy machinery'
        });
        const dept2 = await Department.create({
            name: 'Assembly Area',
            description: 'Final assembly and testing station'
        });
        console.log('✅ Departments created');

        // 2. Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@gearguard.com',
            password: 'password123',
            role: 'admin',
            department_id: dept1.id
        });
        const tech1 = await User.create({
            name: 'John Tech',
            email: 'tech1@gearguard.com',
            password: 'password123',
            role: 'technician',
            department_id: dept1.id
        });
        const employee = await User.create({
            name: 'Sara Worker',
            email: 'sara@gearguard.com',
            password: 'password123',
            role: 'employee',
            department_id: dept2.id
        });
        console.log('✅ Users created');

        // 3. Create Maintenance Team
        const team1 = await MaintenanceTeam.create({
            name: 'Mechanical Squad',
            description: 'Specializes in heavy engine and gear maintenance'
        });

        await TeamMember.create({
            team_id: team1.id,
            user_id: tech1.id,
            role: 'member'
        });
        console.log('✅ Maintenance Team created');

        // 4. Create Equipment
        const equip1 = await Equipment.create({
            name: 'Hydraulic Press HP-500',
            serial_number: 'HP500-001',
            type: 'Production',
            location: 'Station 4',
            status: 'operational',
            department_id: dept1.id,
            employee_id: employee.id,
            team_id: team1.id,
            default_technician_id: tech1.id
        });
        const equip2 = await Equipment.create({
            name: 'Industrial Lathe L-200',
            serial_number: 'L200-88',
            type: 'Machining',
            location: 'Station 12',
            status: 'under_maintenance',
            department_id: dept1.id,
            team_id: team1.id
        });
        console.log('✅ Equipment created');

        // 5. Create Maintenance Requests
        await MaintenanceRequest.create({
            subject: 'Emergency Repair: Lathe Overheating',
            description: 'Motor is making strange noises and overheating after 2 hours of use.',
            type: 'corrective',
            priority: 'high',
            stage: 'new',
            equipment_id: equip2.id,
            team_id: team1.id,
            created_by: admin.id
        });

        await MaintenanceRequest.create({
            subject: 'Monthly Hydraulic Fluid Check',
            description: 'Scheduled preventive maintenance for the hydraulic press.',
            type: 'preventive',
            priority: 'medium',
            stage: 'in_progress',
            equipment_id: equip1.id,
            team_id: team1.id,
            assigned_to: tech1.id,
            created_by: admin.id,
            scheduled_date: new Date(Date.now() + 86400000) // Tomorrow
        });

        console.log('✅ Maintenance Requests created');
        console.log('🚀 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
