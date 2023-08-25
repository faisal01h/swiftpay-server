<?php

namespace App\Enums;

enum TransactionStatus: string
{
    case UNPAID = "UNPAID";
    case PENDING = "PENDING";
    case SUCCESS = "SUCCESS";
    case FAILED = "FAILED";

    case PENDING_REFUND = "PEND_REFUND";
    case SUCCESS_REFUND = "SUCC_REFUND";
    case CANCELED_REFUND = "CANC_REFUND";
}
