import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {EndResult} from "./EndResult";

@Entity()
export class GameResult {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    player1: number;

    @Column()
    player2: number;

    @Column({
        type: "enum",
        enum: EndResult,
        default: EndResult.CANCELED
    })
    result: EndResult;

}