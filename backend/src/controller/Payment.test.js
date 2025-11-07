import { SquareClient } from "square";

async function main() {
    const client = new SquareClient({
        token: "YOUR_ACCESS_TOKEN",
    });
    await client.payments.create({
        idempotencyKey: "{UNIQUE_KEY}",
        amountMoney: {
            amount: BigInt("2000"),
            currency: "USD",
        },
        sourceId: "{PAYMENT_TOKEN_REPRESENTING_A_PAYMENT_SOURCE}",
    });
}
main();
