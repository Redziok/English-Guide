using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mingielewiczinzynierka.Migrations
{
    /// <inheritdoc />
    public partial class fixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "idUser",
                keyValue: 1,
                column: "password",
                value: "$2a$11$Y9SkY1qMvWmOtkFYU0iLPezst4YSKC0AnrmE8YTt/9pgqq7rXIuTu");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "idUser",
                keyValue: 1,
                column: "password",
                value: "$2a$11$vrzuHQ9qziGNz8ld6HI8BuzldAMadEFUgSkK.zhj/W.5ZgkCMJDFK");
        }
    }
}
