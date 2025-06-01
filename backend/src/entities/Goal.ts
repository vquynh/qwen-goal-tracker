// src/entities/Goal.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Action } from './Action';

@Entity()
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('date')
    deadline: string;

    @OneToMany(() => Action, action => action.goal)
    actions: Action[];
}