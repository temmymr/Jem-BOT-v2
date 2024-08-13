import axios from "axios";

export class GBFData {
    private apiLink: string;
    private userRank: number[];
    private crewRank: number[];
    private guildWarId?: number;

    constructor(guildWarId?: number) {
        this.apiLink = "http://gbf.pub/api/gm/gw/";
        this.userRank = [2000, 90000, 140000, 180000];
        this.crewRank = [2000, 5500, 8000, 9000];
        this.guildWarId = guildWarId ?? 73;
    }

    private getDiff(data: number[]) {
        return data.map((point, index) => {
            if (index === 0) {
                return 0;
            }
            return point - data[index - 1];
        });
    }

    private async getSpeedPerHour(data: Array<Record<string, string>>) {
        const lastFiveData = data.slice(data.length - 4, data.length);
        const getPoint = lastFiveData.map((data) => parseInt(data["point"]));
        const diff = this.getDiff(getPoint);
        return diff.reduce((a, b) => {
            return a + b;
        });
    }

    private async findMaxAverage(data: number[]) {
        let maxAverage = 0;
        let maxAverageIndex = 0;

        const diff = this.getDiff(data);

        for (let i = 0; i < diff.length - 4; i++) {
            const window = diff.slice(i, i + 5);
            const average = window.reduce((sum, num) => sum + num, 0) / 5;

            if (average > maxAverage) {
                maxAverage = average;
                maxAverageIndex = i;
            }
        }

        return { maxAverage, maxAverageIndex };
    }

    private async getNDayAgo(data: Array<Record<string, string>>, n: number) {
        const today = new Date();
        const nDaysAgo = new Date(today);
        nDaysAgo.setDate(today.getDate() - n);
        const todayData = data.filter((data) => {
            const date = new Date(0);
            date.setUTCSeconds(parseInt(data["updatetime"]));
            return date.getDate() === today.getDate();
        });
        return todayData;
    }


    public async getRanking() {
        const userRanking = this.userRank.map(async (rank) => {
            const url = `${this.apiLink}line?teamraidid=teamraid0${this.guildWarId}&type=user&rank=${rank}`;
            try {
                const response = await axios.get(url);
                const speed = await this.getSpeedPerHour(response.data.data);
                return {
                    rank,
                    speed,
                    latest: response.data.data[response.data.data.length - 1]["point"],
                };
            } catch (error) {
                return {
                    rank,
                    speed : 0,
                    latest: 0,
                };
            }
        });
        const result = await Promise.all(userRanking);
        return result;
    }

    public async battleCrew(id: number) {
        const newgameRank = await axios.get(`${this.apiLink}point?teamraidid=teamraid${this.guildWarId}&type=guild&id=1959587`);
        const oponentRank = await axios.get(`${this.apiLink}point?teamraidid=teamraid${this.guildWarId}&type=guild&id=${id}`);

        const newgameData = newgameRank.data.data;
        const newgameSpeed = await this.getSpeedPerHour(newgameData);

        const oponentData = oponentRank.data.data;
        const oponentSpeed = await this.getSpeedPerHour(oponentData);

        console.log(newgameSpeed);
        console.log(oponentSpeed);

        return "test";
    }

    public async getRankingCrew(id: number) {
        const response = await axios.get(`${this.apiLink}point?teamraidid=teamraid${this.guildWarId}&type=guild&id=1959587`);

        const getTodayData = await this.getNDayAgo(response.data.data, 1);

        const fastest = await this.findMaxAverage(getTodayData.map((data) => parseFloat(data["point"])));
        // return {
        //     speed,
        //     latest: response.data.data[response.data.data.length - 1]["point"],
        // };
    }

    public async getRankingUser(id: number) {
        const response = await axios.get(`${this.apiLink}point?teamraidid=teamraid0${this.guildWarId}&type=user&id=${id}`);

        console.log(response);
    }
}