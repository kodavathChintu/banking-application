package com.kumaran.BankMSApplication.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.kumaran.BankMSApplication.dto.TransactionDto;
import com.kumaran.BankMSApplication.entity.Account;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Component
public class PdfGenerator {

    public static byte[] generateStatement(
            Account account,
            List<TransactionDto> transactions)
            throws Exception {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                20,
                BaseColor.BLUE);

        Font headingFont = FontFactory.getFont(
                FontFactory.HELVETICA_BOLD,
                12);

        Font normalFont = FontFactory.getFont(
                FontFactory.HELVETICA,
                11);

        // ==========================
        // TITLE
        // ==========================

        Paragraph title = new Paragraph(
                "BANK ACCOUNT STATEMENT",
                titleFont);

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));

        // ==========================
        // CUSTOMER DETAILS
        // ==========================

        document.add(new Paragraph(
                "Customer Name : "
                        + account.getCustomer().getCustomerName(),
                normalFont));

        document.add(new Paragraph(
                "Bank Name : "
                        + account.getBank().getBankName(),
                normalFont));

        document.add(new Paragraph(
                "Branch : "
                        + account.getBank().getBranchName(),
                normalFont));

        document.add(new Paragraph(
                "IFSC : "
                        + account.getBank().getIfscCode(),
                normalFont));

        document.add(new Paragraph(
                "Account Number : "
                        + account.getAccountNumber(),
                normalFont));

        document.add(new Paragraph(
                "Account Type : "
                        + account.getAccountType(),
                normalFont));

        document.add(new Paragraph(
                "Current Balance : ₹"
                        + account.getBalance(),
                normalFont));

        document.add(new Paragraph(" "));

        // ==========================
        // TRANSACTION HEADING
        // ==========================

        Paragraph transactionHeading =
                new Paragraph(
                        "Transaction Details",
                        headingFont);

        transactionHeading.setSpacingAfter(10);

        document.add(transactionHeading);

        // ==========================
        // TRANSACTION TABLE
        // ==========================

        PdfPTable table = new PdfPTable(5);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{3, 2, 2, 4, 3});

        addHeader(table, "Date");
        addHeader(table, "Type");
        addHeader(table, "Amount");
        addHeader(table, "Remarks");
        addHeader(table, "Time");

        for (TransactionDto transaction : transactions) {

            table.addCell(
                    transaction.getTransactionTime()
                            .toLocalDate()
                            .toString());

            table.addCell(
                    transaction.getTransactionType()
                            .toString());

            table.addCell(
                    "₹ " + transaction.getAmount());

            table.addCell(
                    transaction.getRemarks() == null
                            ? "-"
                            : transaction.getRemarks());

            table.addCell(
                    transaction.getTransactionTime()
                            .toLocalTime()
                            .withNano(0)
                            .toString());
        }

        document.add(table);

        document.add(new Paragraph(" "));

        // ==========================
        // SUMMARY
        // ==========================

        document.add(new Paragraph(
                "Total Transactions : "
                        + transactions.size(),
                headingFont));

        document.add(new Paragraph(
                "Generated On : "
                        + LocalDate.now(),
                headingFont));

        document.add(new Paragraph(" "));

        // ==========================
        // FOOTER
        // ==========================

        Paragraph footer =
                new Paragraph(
                        "This is a computer generated statement. Signature is not required.",
                        FontFactory.getFont(
                                FontFactory.HELVETICA_OBLIQUE,
                                10));

        footer.setAlignment(Element.ALIGN_CENTER);

        document.add(footer);

        document.close();

        return out.toByteArray();
    }

    // ==========================
    // TABLE HEADER
    // ==========================

    private static void addHeader(
            PdfPTable table,
            String text) {

        PdfPCell cell = new PdfPCell(
                new Phrase(
                        text,
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD)));

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER);

        cell.setBackgroundColor(
                BaseColor.LIGHT_GRAY);

        table.addCell(cell);
    }
}